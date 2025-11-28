'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Program } from '@/types';
import ProgramPerformersDisplay from '@/components/ProgramPerformersDisplay';
import PerformersEditor from '@/components/PerformersEditor-v3';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 编辑状态
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [editPerformers, setEditPerformers] = useState<[string | null, string[]][] | null>(null);
  const [editBandName, setEditBandName] = useState<string | null>(null);
  const [editParentId, setEditParentId] = useState('');
  const [editSubOrder, setEditSubOrder] = useState(1);
  
  // 添加新节目状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrder, setNewOrder] = useState(0);
  const [newPerformers, setNewPerformers] = useState<[string | null, string[]][] | null>(null);
  const [newBandName, setNewBandName] = useState<string | null>(null);
  const [newParentId, setNewParentId] = useState('');
  const [newSubOrder, setNewSubOrder] = useState(1);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchPrograms();
  }, [router]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      setPrograms(data.programs);
    } catch (error) {
      console.error('获取节目单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换节目完成状态
  const toggleProgramStatus = async (id: string, completed: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/programs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, completed }),
      });

      if (response.ok) {
        setPrograms(programs.map((p) => (p.id === id ? { ...p, completed } : p)));
      }
    } catch (error) {
      console.error('更新节目状态失败:', error);
    }
  };

  // 开始编辑节目
  const startEdit = (program: Program) => {
    setEditingId(program.id);
    setEditTitle(program.title);
    setEditOrder(program.order);
    setEditPerformers(program.performers || null);
    setEditBandName(program.band_name || null);
    setEditParentId(program.parentId || '');
    setEditSubOrder(program.subOrder || 1);
  };

  // 保存编辑
  const saveEdit = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token || !editingId) return;

    if (!editTitle.trim()) {
      alert('标题不能为空！');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/programs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingId,
          title: editTitle,
          order: editOrder,
          performers: editPerformers,
          band_name: editBandName,
          parentId: editParentId || undefined,
          subOrder: editParentId ? editSubOrder : undefined,
        }),
      });

      if (response.ok) {
        setPrograms(
          programs.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: editTitle,
                  order: editOrder,
                  performers: editPerformers,
                  band_name: editBandName,
                  parentId: editParentId || undefined,
                  subOrder: editParentId ? editSubOrder : undefined,
                }
              : p
          )
        );
        cancelEdit();
        alert('节目已更新！');
      }
    } catch (error) {
      console.error('更新节目失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditOrder(0);
    setEditPerformers(null);
    setEditBandName(null);
    setEditParentId('');
    setEditSubOrder(1);
  };

  // 添加新节目
  const addProgram = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    if (!newTitle.trim()) {
      alert('标题不能为空！');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/programs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          order: newOrder,
          performers: newPerformers,
          band_name: newBandName,
          parentId: newParentId || undefined,
          subOrder: newParentId ? newSubOrder : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrograms([...programs, data.program]);
        cancelAdd();
        alert('节目已添加！');
      }
    } catch (error) {
      console.error('添加节目失败:', error);
      alert('添加失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 取消添加
  const cancelAdd = () => {
    setShowAddForm(false);
    setNewTitle('');
    setNewOrder(programs.length + 1);
    setNewPerformers(null);
    setNewBandName(null);
    setNewParentId('');
    setNewSubOrder(1);
  };

  // 删除节目
  const deleteProgram = async (id: string, title: string) => {
    if (!confirm(`确定要删除节目"${title}"吗？此操作无法撤销！`)) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/programs?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPrograms(programs.filter((p) => p.id !== id));
        alert('节目已删除！');
      }
    } catch (error) {
      console.error('删除节目失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 获取主节目列表
  const getMainPrograms = () => {
    return programs.filter(p => !p.parentId);
  };

  // 获取节目编号
  const getProgramNumber = (program: Program) => {
    if (program.parentId) {
      const parentIndex = programs.findIndex(p => p.id === program.parentId && !p.parentId);
      const mainProgramNumber = parentIndex + 1;
      return `${mainProgramNumber}.${program.subOrder || 1}`;
    } else {
      const mainPrograms = programs.filter(p => !p.parentId);
      const mainIndex = mainPrograms.findIndex(p => p.id === program.id);
      return (mainIndex + 1).toString();
    }
  };

  // 格式化演职人员简短显示
  const formatPerformersShort = (performers?: [string | null, string[]][] | null, band_name?: string | null) => {
    const parts = [];
    
    if (band_name) {
      parts.push(band_name);
    }
    
    if (performers && performers.length > 0) {
      const allNames = performers.flatMap(([, names]) => names);
      if (allNames.length > 0) {
        parts.push(allNames.slice(0, 2).join(' ') + (allNames.length > 2 ? '等' : ''));
      }
    }
    
    return parts.join(' - ') || '无';
  };

  const completedCount = programs.filter((p) => p.completed).length;
  const progress = programs.length > 0 ? (completedCount / programs.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">加载节目列表...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 标题和进度 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">节目管理</h1>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              返回管理面板
            </button>
          </div>
          
          <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">
                节目完成进度：{completedCount}/{programs.length}
              </span>
              <span className="text-lg font-bold text-green-600">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 添加节目按钮 */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) {
                setNewOrder(programs.length + 1);
              }
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md"
          >
            {showAddForm ? '取消添加' : '+ 添加新节目'}
          </button>
        </div>

        {/* 添加节目表单 */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加新节目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  节目标题 *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="请输入节目标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  顺序 *
                </label>
                <input
                  type="number"
                  value={newOrder}
                  onChange={(e) => setNewOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  父节目（可选）
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                >
                  <option value="">无（主节目）</option>
                  {getMainPrograms().map((program) => (
                    <option key={program.id} value={program.id}>
                      {getProgramNumber(program)}. {program.title}
                    </option>
                  ))}
                </select>
              </div>
              {newParentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    子节目序号
                  </label>
                  <input
                    type="number"
                    value={newSubOrder}
                    onChange={(e) => setNewSubOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  />
                </div>
              )}
            </div>
            
            <PerformersEditor
              performers={newPerformers}
              band_name={newBandName}
              onUpdate={(performers, band_name) => {
                setNewPerformers(performers);
                setNewBandName(band_name);
              }}
              className="mb-4"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={addProgram}
                disabled={saving}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {saving ? '添加中...' : '确认添加'}
              </button>
              <button
                onClick={cancelAdd}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 节目列表 */}
        <div className="space-y-4">
          {programs.map((program) => {
            const isSubProgram = !!program.parentId;
            const programNumber = getProgramNumber(program);
            const isEditing = editingId === program.id;
            
            return (
              <div
                key={program.id}
                className={`rounded-xl p-4 transition-all border-2 ${
                  isSubProgram ? 'ml-10 bg-blue-50 border-blue-200' : ''
                } ${
                  program.completed
                    ? 'bg-green-50 border-green-300'
                    : isSubProgram ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  {!isSubProgram && (
                    <div className="flex-shrink-0 mr-4">
                      <button
                        onClick={() => toggleProgramStatus(program.id, !program.completed)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                          program.completed
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {program.completed ? '✓' : programNumber}
                      </button>
                    </div>
                  )}

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            placeholder="节目标题"
                          />
                          <input
                            type="number"
                            value={editOrder}
                            onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            placeholder="顺序"
                          />
                        </div>
                        <PerformersEditor
                          performers={editPerformers}
                          band_name={editBandName}
                          onUpdate={(performers, band_name) => {
                            setEditPerformers(performers);
                            setEditBandName(band_name);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className={`text-lg font-semibold ${
                          program.completed ? 'text-green-700' : 'text-gray-800'
                        }`}>
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          演职人员：{formatPerformersShort(program.performers, program.band_name)} | 顺序：{program.order}
                          {program.parentId && (
                            <span className="ml-2 text-blue-600">
                              (子节目 {program.subOrder})
                            </span>
                          )}
                        </p>
                        
                        {/* 演职人员详细信息 */}
                        {(program.performers || program.band_name) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <ProgramPerformersDisplay 
                              performers={program.performers} 
                              band_name={program.band_name}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {isSubProgram && (
                      <button
                        onClick={() => toggleProgramStatus(program.id, !program.completed)}
                        className="px-3 py-2 bg-white/70 border border-gray-300 text-gray-800 text-xs rounded-lg hover:bg-white transition-all"
                      >
                        {program.completed ? '✓ 已完成' : '○ 标记完成'}
                      </button>
                    )}
                    
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {saving ? '保存中...' : '保存'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(program)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => deleteProgram(program.id, program.title)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">暂无节目，点击上方按钮添加第一个节目吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
