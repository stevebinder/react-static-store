import React, { createElement, Component as ReactComponent } from 'react';

const filterFunctions = obj => Object.entries(obj).reduce(
  (result, [key, value]) => ({
    ...result,
    ...(typeof value === 'function' ? {} : { [key]: value }),
  }),
  {},
);

const isEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  if (
    (a !== null && typeof a === 'object')
    && (b !== null && typeof b === 'object')
  ) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    for (const key in a) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
  return false;
};

const createHOC = (Component, Context, getter) => {
  const creator = typeof getter === 'function'
    ? (c, p) => getter(c, p)
    : c => getter.reduce(
        (result, key) => ({
          ...result,
          [key]: c[key],
        }),
        {},
      );
  class WrapperComponent extends ReactComponent {
    shouldComponentUpdate(prevProps, prevState) {
      if (isEqual(prevProps, this.props) && isEqual(prevState, this.state)) {
        return false;
      }
      if (isEqual(filterFunctions(prevProps), filterFunctions(this.props))) {
        return false;
      }
      return true;
    }
    render() {
      return <Component {...this.props} />
    }
  }
  return props => (
    <Context>
    {context => (
      <WrapperComponent
        {...props}
        {...creator(context, props)}
      />
    )}
    </Context>
  );
};

export default (...args) => {
  if (args.length === 3) {
    return createHOC(...args);
  }
  if (args.length === 5) {
    return createHOC(
      args[0],
      args[1],
      createHOC(
        args[2],
        args[3],
        args[4],
      ),
    );
  }
  if (args.length === 7) {
    return createHOC(
      args[0],
      args[1],
      createHOC(
        args[2],
        args[3],
        createHOC(
          args[4],
          args[5],
          args[6],
        ),
      ),
    );
  }
}