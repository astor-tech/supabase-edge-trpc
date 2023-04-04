import { api } from './trpc';

export default function VillainList() {
  const villains = api.getVillains.useQuery();
  return (
    <div>
      <h1>The Villains</h1>
      <ul>
        {villains.data?.map((villain) => (
          <li key={villain.id}>
            {villain.name} - {villain.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
}
