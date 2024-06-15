import './App.css';
import { useAppSelector, useAppDispatch } from './app/hook';
import { increment, decrement, incrementByAmount } from './features/counter/counterSlice';

function App() {
  const counter = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="App">
      {counter}
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
      <div>
        <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
      </div>
    </div>
  );
}

export default App;
