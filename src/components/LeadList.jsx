import { createSignal, onMount, For } from 'solid-js';
import { createEvent } from '../supabaseClient';

function LeadList(props) {
  const [leads, setLeads] = createSignal([]);
  const [newLead, setNewLead] = createSignal({ name: '', email: '' });
  const [loading, setLoading] = createSignal(false);

  const fetchLeads = async () => {
    // Fetch leads from backend or database
    setLoading(true);
    try {
      const response = await fetch('/api/getLeads', {
        headers: {
          'Authorization': `Bearer ${(await props.user()).access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        console.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Save new lead
    try {
      const response = await fetch('/api/addLead', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await props.user()).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLead())
      });
      if (response.ok) {
        setLeads([...leads(), await response.json()]);
        setNewLead({ name: '', email: '' });
      } else {
        console.error('Failed to add lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchLeads);

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Lead Lists</h2>
      <form onSubmit={addLead} class="mb-6">
        <div class="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newLead().name}
            onInput={(e) => setNewLead({ ...newLead(), name: e.target.value })}
            class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newLead().email}
            onInput={(e) => setNewLead({ ...newLead(), email: e.target.value })}
            class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading()}
        >
          {loading() ? 'Adding...' : 'Add Lead'}
        </button>
      </form>
      <div>
        <h3 class="text-xl font-bold mb-2 text-purple-600">Your Leads</h3>
        {loading() ? (
          <p>Loading leads...</p>
        ) : (
          <div class="space-y-4">
            <For each={leads()}>
              {(lead) => (
                <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                  <p class="font-semibold">{lead.name}</p>
                  <p class="text-gray-600">{lead.email}</p>
                </div>
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadList;