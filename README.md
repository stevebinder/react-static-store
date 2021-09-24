Creates a simple store for your **React application** that is manipulated with the state/setState api familiar to React developers. Data in the state can be accessed via HOC or direct reference.

Create the store with **createStaticContext**.

```js
import createStaticContext from 'react-static-context';

const MyStore = createStaticContext(
  (state, setState) => ({
    age: 30,
    setAge: age => setState({ age }),
    setAgeByX: x => setState({ age: state.age + x }),
  }),
  (state, setState) => {
    const daysSinceEpoch = Math.ceil(Date.now() / 86400000);
    setState({ age: daysSinceEpoch });
  },
);
```

Access the store in a **Component**:

````js
const MyComponent = ({ name }) => (
  <MyStore>
  {store => (
    <div>
      <p>Hello {name} your age is {age}</p>
      <button onClick={() => store.setAge(35)}>Set Age</button>
    </div>
  )}
  </MyStore>
);
```

Access the store in a Component with a **HOC**:

```js
const MyComponent = ({ age }) => <div>{age}</div>;

const MyWrappedComponent = Store.with(MyComponent, ['age']);
```

Access the store via **direct reference**:

```js
const myMethod = () => {
  Store.setAge(20);
  alert('Age is now ' + Store.age);
};
```