import { createSignal, onMount, For, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';

function EmailSender(props) {
  const [subject, setSubject] = createSignal('');
  const [body, setBody] = createSignal('');
  const [leadLists, setLeadLists] = createSignal([]);
  const [selectedLists, setSelectedLists] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchLeadLists = async () => {
    // Fetch available lead lists
    setLoading(true);
    try {
      const response = await fetch('/api/getLeadLists', {
        headers: {
          'Authorization': `Bearer ${(await props.user()).access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeadLists(data);
      } else {
        console.error('Failed to fetch lead lists');
      }
    } catch (error) {
      console.error('Error fetching lead lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/sendMassEmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await props.user()).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: subject(),
          body: body(),
          lists: selectedLists()
        })
      });
      if (response.ok) {
        alert('Emails sent successfully!');
        setSubject('');
        setBody('');
        setSelectedLists([]);
      } else {
        console.error('Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchLeadLists);

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Mass Email Sender</h2>
      <form onSubmit={sendEmail} class="space-y-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject()}
          onInput={(e) => setSubject(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-700"
          required
        />
        <textarea
          placeholder="Email Body"
          value={body()}
          onInput={(e) => setBody(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-gray-700"
          rows="6"
          required
        ></textarea>
        <div>
          <h3 class="text-xl font-bold mb-2 text-purple-600">Select Lead Lists</h3>
          <div class="space-y-2">
            <For each={leadLists()}>
              {(list) => (
                <div>
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={list.id}
                      checked={selectedLists().includes(list.id)}
                      onChange={(e) => {
                        const id = list.id;
                        if (e.target.checked) {
                          setSelectedLists([...selectedLists(), id]);
                        } else {
                          setSelectedLists(selectedLists().filter((i) => i !== id));
                        }
                      }}
                      class="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span class="ml-2 text-gray-700">{list.name}</span>
                  </label>
                </div>
              )}
            </For>
          </div>
        </div>
        <button
          type="submit"
          class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading()}
        >
          {loading() ? 'Sending...' : 'Send Email'}
        </button>
      </form>
    </div>
  );
}

export default EmailSender;