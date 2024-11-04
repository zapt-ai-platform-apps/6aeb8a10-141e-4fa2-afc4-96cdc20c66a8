import { createSignal } from 'solid-js';
import LeadList from './LeadList';
import EmailSender from './EmailSender';
import FormCreator from './FormCreator';
import AnalyticsDashboard from './AnalyticsDashboard';
import FeedbackArea from './FeedbackArea';
import SocialIntegration from './SocialIntegration';
import { supabase } from '../supabaseClient';
import { useNavigate } from '@solidjs/router';

function Dashboard(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = createSignal('leadList');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div class="max-w-6xl mx-auto h-full">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">Lead Management</h1>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>

        <div class="flex h-full">
          <nav class="w-1/4 pr-4">
            <ul class="space-y-2">
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'leadList' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('leadList')}>Lead Lists</button>
              </li>
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'emailSender' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('emailSender')}>Mass Email Sender</button>
              </li>
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'formCreator' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('formCreator')}>Form Creator</button>
              </li>
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'analytics' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('analytics')}>Analytics Dashboard</button>
              </li>
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'feedback' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('feedback')}>User Feedback</button>
              </li>
              <li>
                <button class={`w-full text-left px-4 py-2 rounded-md ${activeTab() === 'socialIntegration' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} cursor-pointer`} onClick={() => setActiveTab('socialIntegration')}>Social Media Integration</button>
              </li>
            </ul>
          </nav>
          <main class="w-3/4 h-full overflow-y-auto">
            {activeTab() === 'leadList' && <LeadList user={props.user} />}
            {activeTab() === 'emailSender' && <EmailSender user={props.user} />}
            {activeTab() === 'formCreator' && <FormCreator user={props.user} />}
            {activeTab() === 'analytics' && <AnalyticsDashboard user={props.user} />}
            {activeTab() === 'feedback' && <FeedbackArea user={props.user} />}
            {activeTab() === 'socialIntegration' && <SocialIntegration user={props.user} />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;