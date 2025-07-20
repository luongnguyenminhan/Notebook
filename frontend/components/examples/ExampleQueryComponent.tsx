// components/ui/ExampleComponent.tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function fetchExampleData() {
  const { data } = await axios.get('/api/example');
  return data;
}

export function ExampleComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exampleData'],
    queryFn: fetchExampleData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <h1>Example Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
