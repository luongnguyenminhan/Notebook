// components/examples/ExampleReduxComponent.tsx
'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { increment, decrement, setValue } from '@/store/slices/exampleSlice';
import Button from '@/components/ui/Button';

export function ExampleReduxComponent() {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.example.value);

  return (
    <div>
      <h1>Redux Value: {value}</h1>
      <Button onClick={() => dispatch(increment())}>Increment</Button>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      <Button onClick={() => dispatch(setValue(10))}>Set Value to 10</Button>
    </div>
  );
}
