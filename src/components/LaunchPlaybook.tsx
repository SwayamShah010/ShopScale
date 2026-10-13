import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  Calendar,
  Layers,
  Plus,
  Rocket,
  CheckCircle2,
  DollarSign,
  Gift,
  Users,
  Compass,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { CampaignData, LaunchTask, ShopProfile, TerritoryZone } from '../types';

interface LaunchPlaybookProps {
  shop: ShopProfile;
  zone: TerritoryZone;
  tasks: LaunchTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<LaunchTask, 'id'>) => void;
  campaign: CampaignData | null;
  onGenerateCampaign: (budget: number) => Promise<void>;
  isGeneratingCampaign: boolean;
}

export const LaunchPlaybook: React.FC<LaunchPlaybookProps> = ({
  shop,
  zone,
  tasks,
  onToggleTask,
  onAddTask,
  campaign,
  onGenerateCampaign,
  isGeneratingCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'marketing'>('roadmap');
  const [launchBudget, setLaunchBudget] = useState<number>(3500);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPhase, setNewTaskPhase] = useState<number>(1);
  const [newTaskCategory, setNewTaskCategory] = useState<LaunchTask['category']>('Site & Lease');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  // Calculate overall task progress
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const phases = [
    { id: 1, title: 'Phase 1: Site Scouting & Lease Finalization', weeks: 'Weeks 1-3' },
    { id: 2, title: 'Phase 2: Permitting, Architecture & Build-Out', weeks: 'Weeks 4-7' },
    { id: 3, title: 'Phase 3: Staffing, Training & Supply Chains', weeks: 'Weeks 8-9' },
    { id: 4, title: 'Phase 4: Hyperlocal Buzz & Soft Launch', weeks: 'Weeks 10-11' },
    { id: 5, title: 'Phase 5: Grand Opening & Community Blitz', weeks: 'Week 12+' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      phaseId: newTaskPhase,
      title: newTaskTitle.trim(),
      description: 'Custom expansion milestone added by team.',
      category: newTaskCategory,
      completed: false,
      targetWeek: `Week ${newTaskPhase * 2}`,
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Execution Roadmap
            </span>
            <span className="text-xs text-slate-400">
              Expansion Target: <strong className="text-slate-200">{zone.name}</strong>
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-100 mt-1">
            90-Day Expansion Playbook & Local Launch Engine
          </h2>
          <p className="text-xs text-slate-400">
            Actionable week-by-week milestones from lease negotiations to hyperlocal opening day activation.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            90-Day Milestone Checklist
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'marketing'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Hyperlocal Marketing Plan
          </button>
        </div>
      </div>

      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Progress Bar Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-emerald-400" />
                Expansion Launch Readiness
              </span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {progressPercent}% Complete ({completedCount} / {tasks.length} milestones)
              </span>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Phased Accordion / Timeline */}
          <div className="space-y-4">
            {phases.map((phase) => {
              const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
              const phaseDoneCount = phaseTasks.filter((t) => t.completed).length;

              return (
                <div
                  key={phase.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                        {phase.id}
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">{phase.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {phase.weeks}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {phaseDoneCount}/{phaseTasks.length} done
                      </span>
                    </div>
                  </div>

                  {/* Tasks in Phase */}
                  <div className="space-y-2">
                    {phaseTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          task.completed
                            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-xs font-semibold ${
                                task.completed
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-200'
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                                {task.category}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {task.targetWeek}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Task Form */}
          {isAddingTask ? (
            <form
              onSubmit={handleCreateTask}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Add Custom Expansion Milestone
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Task title (e.g. Schedule health inspection)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="md:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
                <select
                  value={newTaskPhase}
                  onChange={(e) => setNewTaskPhase(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>Phase 1: Site & Lease</option>
                  <option value={2}>Phase 2: Permits & Buildout</option>
                  <option value={3}>Phase 3: Staffing & Ops</option>
                  <option value={4}>Phase 4: Soft Launch</option>
                  <option value={5}>Phase 5: Grand Opening</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="w-full py-3 border border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl text-xs text-slate-400 hover:text-emerald-300 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Custom Task to Playbook
            </button>
          )}
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="space-y-6">
          {/* Campaign Generator Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Hyperlocal Launch Campaign Builder
              </h3>
              <p className="text-xs text-slate-400">
                Tailored 4-pillar customer acquisition blitz specifically configured for {zone.name}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400">Launch Budget:</span>
                <input
                  type="number"
                  step="500"
                  min="500"
                  max="20000"
                  value={launchBudget}
                  onChange={(e) => setLaunchBudget(Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-emerald-400 focus:outline-none"
                />
              </div>

              <button
                onClick={() => onGenerateCampaign(launchBudget)}
                disabled={isGeneratingCampaign}
                className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg"
              >
                {isGeneratingCampaign ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Re-Generate Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {campaign ? (
            <div className="space-y-6">
              {/* Campaign Theme Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Campaign Strategic Theme
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  "{campaign.campaignTheme}"
                </h3>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 font-bold text-xs flex items-center justify-center border border-teal-500/20">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">{pillar.name}</h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        ${pillar.costEstimate}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Timing:</strong> {pillar.timing}
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {pillar.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong className="text-teal-400">Conversion Hook:</strong> {pillar.conversionHook}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activations & Partnerships */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" /> VIP Soft Opening
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {campaign.vipSoftOpeningStrategy}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Community Partnership
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {campaign.communityPartnershipIdea}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Rocket className="w-4 h-4" /> Opening Day Activator
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {campaign.openingDayCrowdActivator}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
              <p className="text-sm">Click "Generate Plan" above to create an AI-powered local launch blitz.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
