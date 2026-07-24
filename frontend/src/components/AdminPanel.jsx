import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router';
import { ArrowLeft, Plus, Trash2, Code2, Sparkles, Terminal, Database, BookOpen, Check } from 'lucide-react';
import { useState } from 'react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState(0); // 0: C++, 1: Java, 2: JS

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [
        { input: '', output: '', explanation: '' }
      ],
      hiddenTestCases: [
        { input: '', output: '' }
      ],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lc-page min-h-screen bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-4">
            <NavLink 
              to="/admin" 
              className="p-2 rounded-lg bg-[#1f1f1f] hover:bg-[#282828] border border-[#333333] text-[#a3a3a3] hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={18} />
            </NavLink>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#3d2a12] px-3 py-1 text-xs font-semibold text-[#ffa116] mb-1">
                <Sparkles size={12} />
                Admin Dashboard
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create New <span className="gradient-text">Problem</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Form Validation Error Summary Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-rose-900/50 bg-[#3a1d24]/40 text-rose-200 font-mono text-xs space-y-1">
            <div className="font-bold flex items-center gap-2 text-rose-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              Please correct the following errors:
            </div>
            {errors.title && <div>• Title: {errors.title.message}</div>}
            {errors.description && <div>• Description: {errors.description.message}</div>}
            {errors.difficulty && <div>• Difficulty: {errors.difficulty.message}</div>}
            {errors.tags && <div>• Category Tag: {errors.tags.message}</div>}
            {errors.visibleTestCases && <div>• Visible Test Cases: {errors.visibleTestCases.message || 'Check all visible test case fields'}</div>}
            {errors.hiddenTestCases && <div>• Hidden Test Cases: {errors.hiddenTestCases.message || 'Check all hidden test case fields'}</div>}
            {errors.startCode && <div>• Starter Code Templates: {errors.startCode.message}</div>}
            {errors.referenceSolution && <div>• Reference Solutions: {errors.referenceSolution.message}</div>}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* 1. Basic Information */}
          <div className="lc-card p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
              <BookOpen className="text-[#ffa116]" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">1. Basic Information</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] mb-2 font-mono">
                  Problem Title
                </label>
                <input
                  {...register('title')}
                  placeholder="e.g. Two Sum"
                  className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#ffa116] focus:bg-[#1a1a1a] text-sm text-white px-4 py-3 rounded-lg outline-none transition duration-200 font-mono"
                />
                {errors.title && (
                  <span className="text-[#ff375f] text-xs font-mono mt-1.5 block">{errors.title.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] mb-2 font-mono">
                  Problem Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Describe the problem, input format, output format, constraints..."
                  className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#ffa116] focus:bg-[#1a1a1a] text-sm text-white p-4 rounded-lg outline-none transition duration-200 font-mono resize-y"
                />
                {errors.description && (
                  <span className="text-[#ff375f] text-xs font-mono mt-1.5 block">{errors.description.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] mb-2 font-mono">
                    Difficulty Level
                  </label>
                  <select
                    {...register('difficulty')}
                    className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#ffa116] text-sm text-white px-4 py-3 rounded-lg outline-none transition duration-200 font-mono cursor-pointer"
                  >
                    <option value="easy" className="bg-[#1f1f1f] text-[#00b8a3]">Easy</option>
                    <option value="medium" className="bg-[#1f1f1f] text-[#ffc01e]">Medium</option>
                    <option value="hard" className="bg-[#1f1f1f] text-[#ff375f]">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] mb-2 font-mono">
                    Category Tag
                  </label>
                  <select
                    {...register('tags')}
                    className="w-full bg-[#171717] border border-[#2a2a2a] focus:border-[#ffa116] text-sm text-white px-4 py-3 rounded-lg outline-none transition duration-200 font-mono cursor-pointer"
                  >
                    <option value="array" className="bg-[#1f1f1f]">Array</option>
                    <option value="linkedList" className="bg-[#1f1f1f]">Linked List</option>
                    <option value="graph" className="bg-[#1f1f1f]">Graph</option>
                    <option value="dp" className="bg-[#1f1f1f]">Dynamic Programming</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Test Cases Configuration */}
          <div className="lc-card p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
              <Database className="text-[#ffa116]" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">2. Test Cases</h2>
            </div>
            
            {/* Visible Test Cases */}
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <div>
                  <h3 className="font-mono font-bold text-sm text-[#e5e5e5] uppercase">Visible Test Cases</h3>
                  <p className="text-xs text-[#8a8a8a] font-mono mt-0.5">Visible to users in the workspace description</p>
                </div>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#3d2a12] text-[#ffa116] hover:bg-[#4b3417] transition font-mono text-xs font-bold cursor-pointer"
                >
                  <Plus size={14} /> Add Case
                </button>
              </div>
              
              {visibleFields.map((field, index) => (
                <div key={field.id} className="border border-[#2d2d2d] p-5 rounded-xl space-y-4 bg-[#171717] hover:border-[#3d3d3d] transition duration-200">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#ffa116] flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ffa116]/10 text-xs">
                        {index + 1}
                      </span>
                      Visible Case
                    </span>
                    {visibleFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-mono font-bold cursor-pointer transition duration-150"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#8a8a8a] mb-1 uppercase tracking-wider">Input</label>
                      <textarea
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="e.g. nums = [2,7,11,15], target = 9"
                        rows={2}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#ffa116] text-xs text-white p-3 rounded-lg font-mono outline-none resize-y"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-[#8a8a8a] mb-1 uppercase tracking-wider">Output</label>
                      <textarea
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="e.g. [0,1]"
                        rows={2}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#ffa116] text-xs text-white p-3 rounded-lg font-mono outline-none resize-y"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-[#8a8a8a] mb-1 uppercase tracking-wider">Explanation</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explain why the input gives this output..."
                      rows={2}
                      className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#ffa116] text-xs text-white p-3 rounded-lg font-mono outline-none resize-y"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-5 pt-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <div>
                  <h3 className="font-mono font-bold text-sm text-[#e5e5e5] uppercase">Hidden Test Cases</h3>
                  <p className="text-xs text-[#8a8a8a] font-mono mt-0.5">Used silently to evaluate and score submitted code</p>
                </div>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#1f1f1f] text-[#ffa116] hover:bg-[#282828] border border-[#333333] transition font-mono text-xs font-bold cursor-pointer"
                >
                  <Plus size={14} /> Add Hidden Case
                </button>
              </div>
              
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border border-[#2d2d2d] p-5 rounded-xl space-y-4 bg-[#171717] hover:border-[#3d3d3d] transition duration-200">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#00b8a3] flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00b8a3]/10 text-xs">
                        {index + 1}
                      </span>
                      Hidden Case
                    </span>
                    {hiddenFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-mono font-bold cursor-pointer transition duration-150"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#8a8a8a] mb-1 uppercase tracking-wider">Input</label>
                      <textarea
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Hidden Input data..."
                        rows={2.5}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#00b8a3] text-xs text-white p-3 rounded-lg font-mono outline-none resize-y"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-[#8a8a8a] mb-1 uppercase tracking-wider">Output</label>
                      <textarea
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Expected Output data..."
                        rows={2.5}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#00b8a3] text-xs text-white p-3 rounded-lg font-mono outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Code Templates */}
          <div className="lc-card p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
              <Code2 className="text-[#ffa116]" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">3. Code Templates & Solutions</h2>
            </div>
            
            {/* Tabs Selector */}
            <div className="flex border-b border-[#222222] p-1 gap-2">
              {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveCodeTab(index)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold transition duration-200 ${
                    activeCodeTab === index 
                      ? 'bg-[#3d2a12] text-[#ffa116] border border-[#ffa116]/20' 
                      : 'text-[#8a8a8a] hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Starter Code & Complete Code inputs */}
            {[0, 1, 2].map((index) => {
              const langName = index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript';
              const placeholderStarter = index === 0 
                ? 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};'
                : index === 1
                ? 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}'
                : 'function twoSum(nums, target) {\n    \n}';

              const placeholderSolution = index === 0 
                ? 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your complete accepted solution here...\n    }\n};'
                : index === 1
                ? 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your complete accepted solution here...\n    }\n}'
                : 'function twoSum(nums, target) {\n    // Your complete accepted solution here...\n}';

              return (
                <div 
                  key={index} 
                  className={`space-y-5 transition duration-150 ${activeCodeTab === index ? 'block' : 'hidden'}`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] font-mono">
                        Starter Code Template ({langName})
                      </label>
                      <span className="text-[10px] text-[#8a8a8a] font-mono">This is what the user starts with in their editor</span>
                    </div>
                    <div className="relative">
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        rows={10}
                        placeholder={placeholderStarter}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#ffa116] text-[#e0e0e0] font-mono p-4 rounded-lg text-xs outline-none leading-relaxed"
                      />
                      <Terminal size={14} className="absolute right-4 bottom-4 text-[#4a4a4a]" />
                    </div>
                    {errors.startCode?.[index]?.initialCode && (
                      <span className="text-[#ff375f] text-xs font-mono mt-1 block">{errors.startCode[index].initialCode.message}</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#a3a3a3] font-mono">
                        Reference Complete Solution ({langName})
                      </label>
                      <span className="text-[10px] text-[#8a8a8a] font-mono">Used behind the scenes to double check logic</span>
                    </div>
                    <div className="relative">
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        rows={10}
                        placeholder={placeholderSolution}
                        className="w-full bg-[#121212] border border-[#2d2d2d] focus:border-[#ffa116] text-[#e0e0e0] font-mono p-4 rounded-lg text-xs outline-none leading-relaxed"
                      />
                      <Terminal size={14} className="absolute right-4 bottom-4 text-[#4a4a4a]" />
                    </div>
                    {errors.referenceSolution?.[index]?.completeCode && (
                      <span className="text-[#ff375f] text-xs font-mono mt-1 block">{errors.referenceSolution[index].completeCode.message}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl bg-[#00b85a] hover:bg-[#00a650] active:scale-[0.99] text-white font-mono font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#00b85a]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Problem in Arena...' : 'Create Problem in Arena'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;