import { PureComponent } from 'react';
import withStaticStore from './withStaticStore';

export default (creator, initializer = null) => {

  let initialized = false;
  const listeners = [];
  const stateValue = {};

  const addListener = obj => listeners.push(obj);

  const createState = component => creator(
    stateValue,
    setState,
  );

  const removeListener = obj => listeners.splice(
    listeners.findIndex(item => item === obj),
    1,
  );

  const setState = (changes, callback) => {
    updateState(changes);
    listeners.forEach((listener, index) => {
      if (index === listeners.length - 1) {
        listener.forceUpdate(callback);
      } else {
        listener.forceUpdate();
      }
    });
  };

  const updateState = (changes = {}) =>
    Object.entries(changes).forEach(([key, value]) => stateValue[key] = value);

  class SC extends PureComponent {

    constructor(props) {
      super(props);
      if (!initialized) {
        initialized = true;
        const createdState = createState(this);
        updateState(createdState);
        SC.with = (...args) => withStaticStore(args[0], SC, ...args.slice(1));
        Object.entries(createdState).forEach(([key, value]) => {
          if (typeof value === 'function') {
            SC[key] = value;
          } else {
            Object.defineProperty(
              SC,
              key,
              {
                get: () => stateValue[key],
                set: v => stateValue[key] = v,
              },
            );
          }
        });
        if (initializer) {
          setTimeout(async () => {
            await initializer(stateValue, setState);
            setState();
          });
        }
      }
    }

    componentDidMount() {
      addListener(this);
    }

    componentWillUnmount() {
      removeListener(this);
    }

    render() {
      return typeof this.props.children === 'function'
        ? this.props.children(stateValue)
        : this.props.children;
    }
  }

  new SC();

  return SC;
}