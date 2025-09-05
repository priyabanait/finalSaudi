import express from 'express';
import { syncAgentsFromKWPeople,fetchPropertiesWithAgents, syncAgentsFromMultipleKWPeople, getFilteredAgents, getLeadsFromAgents, createLead, updateLead, deleteLead} from '../controllers/agentController.js';

const router = express.Router();

router.get('/agent/:org_id', syncAgentsFromKWPeople);
router.get('/agents/merge', getFilteredAgents);

// Leads endpoints
router.get('/leads', getLeadsFromAgents);

// Form submission endpoint
router.post('/leads', createLead);
router.get('/agents/merge/multiple', syncAgentsFromMultipleKWPeople);
// CRUD operations for leads
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);
router.post('/properties', fetchPropertiesWithAgents);
export default router;