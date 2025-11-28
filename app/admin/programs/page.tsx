'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Program } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInfo, setEditInfo] = useState('');
  const [editingBasicId, setEditingBasicId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPerformer, setEditPerformer] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPerformer, setNewPerformer] = useState('');
  const [newOrder, setNewOrder] = useState(0);
  const [newParentId, setNewParentId] = useState('');
  const [newSubOrder, setNewSubOrder] = useState(1);
  const [editParentId, setEditParentId] = useState('');
  const [editSubOrder, setEditSubOrder] = useState(1);
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
        setPrograms(
          programs.map((p) => (p.id === id ? { ...p, completed } : p))
        );
      }
    } catch (error) {
      console.error('更新节目状态失败:', error);
    }
  };

  const startEditInfo = (program: Program) => {
    setEditingId(program.id);
    setEditInfo(program.info || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditInfo('');
  };

  const saveInfo = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setSaving(true);
    try {
      const response = await fetch('/api/programs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, info: editInfo }),
      });

      if (response.ok) {
        setPrograms(
          programs.map((p) => (p.id === id ? { ...p, info: editInfo } : p))
        );
        setEditingId(null);
        setEditInfo('');
        alert('节目详情已更新！');
      }
    } catch (error) {
      console.error('更新节目详情失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 开始编辑基本信息
  const startEditBasic = (program: Program) => {
    setEditingBasicId(program.id);
    setEditTitle(program.title);
    setEditPerformer(program.performer);
    setEditOrder(program.order);
    setEditParentId(program.parentId || '');
    setEditSubOrder(program.subOrder || 1);
  };

  // 保存基本信息
  const saveBasicInfo = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

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
          id, 
          title: editTitle, 
          performer: editPerformer, 
          order: editOrder,
          parentId: editParentId || undefined,
          subOrder: editParentId ? editSubOrder : undefined
        }),
      });

      if (response.ok) {
        setPrograms(
          programs.map((p) => 
            p.id === id 
              ? { 
                  ...p, 
                  title: editTitle, 
                  performer: editPerformer, 
                  order: editOrder,
                  parentId: editParentId || undefined,
                  subOrder: editParentId ? editSubOrder : undefined
                } 
              : p
          )
        );
        setEditingBasicId(null);
        alert('节目信息已更新！');
      }
    } catch (error) {
      console.error('更新节目信息失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 取消编辑基本信息
  const cancelEditBasic = () => {
    setEditingBasicId(null);
    setEditTitle('');
    setEditPerformer('');
    setEditOrder(0);
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
          performer: newPerformer, 
          order: newOrder,
          parentId: newParentId || undefined,
          subOrder: newParentId ? newSubOrder : undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrograms([...programs, data.program]);
        setShowAddForm(false);
        setNewTitle('');
        setNewPerformer('');
        setNewOrder(programs.length + 1);
        setNewParentId('');
        setNewSubOrder(1);
        alert('节目已添加！');
      }
    } catch (error) {
      console.error('添加节目失败:', error);
      alert('添加失败，请重试');
    } finally {
      setSaving(false);
    }
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

  // 获取主节目列表（用于下拉选择）
  const getMainPrograms = () => {
    return programs.filter(p => !p.parentId);
  };

  // 获取程序显示编号
  const getProgramNumber = (program: Program) => {
    if (program.parentId) {
      // 子节目显示为 "1.1", "1.2" 等
      const parentIndex = programs.findIndex(p => p.id === program.parentId && !p.parentId);
      const mainProgramNumber = parentIndex + 1;
      return `${mainProgramNumber}.${program.subOrder || 1}`;
    } else {
      // 主节目显示为 "1", "2" 等
      const mainPrograms = programs.filter(p => !p.parentId);
      const mainIndex = mainPrograms.findIndex(p => p.id === program.id);
      return (mainIndex + 1).toString();
    }
  };

  const completedCount = programs.filter((p) => p.completed).length;
  const progress =
    programs.length > 0 ? (completedCount / programs.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">📋 节目管理</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setNewOrder(programs.length + 1);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
              >
                ➕ 添加节目
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
              >
                返回控制台
              </Link>
            </div>
          </div>

          {/* 添加节目表单 */}
          {showAddForm && (
            <div className="mb-6 p-6 bg-green-50 rounded-xl border-2 border-green-300">
              <h3 className="font-bold text-lg text-gray-800 mb-4">➕ 添加新节目</h3>
              <div className="space-y-3">
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
                    表演者
                  </label>
                  <input
                    type="text"
                    value={newPerformer}
                    onChange={(e) => setNewPerformer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    placeholder="请输入表演者（可选）"
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
                    placeholder="节目顺序"
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
                      placeholder="子节目序号"
                      min="1"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={addProgram}
                    disabled={saving}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                  >
                    {saving ? '添加中...' : '✓ 确认添加'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTitle('');
                      setNewPerformer('');
                      setNewOrder(0);
                      setNewParentId('');
                      setNewSubOrder(1);
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 进度条 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                整体进度
              </span>
              <span className="text-sm font-medium text-gray-700">
                {completedCount}/{programs.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center text-2xl font-bold text-green-600">
              {Math.round(progress)}%
            </div>
          </div>

          {/* 节目列表 */}
          <div className="space-y-3">
            {programs.map((program, index) => {
              const isSubProgram = !!program.parentId;
              const programNumber = getProgramNumber(program);
              
              return (
              <div
                key={program.id}
                className={`rounded-xl p-4 transition-all border-2 ${
                  isSubProgram ? 'ml-8 bg-blue-50 border-blue-200' : ''
                } ${
                  program.completed
                    ? 'bg-green-50 border-green-300'
                    : isSubProgram ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <button
                      onClick={() =>
                        toggleProgramStatus(program.id, !program.completed)
                      }
                      className={`${
                        isSubProgram ? 'w-12 h-6 rounded text-xs' : 'w-10 h-10 rounded-full text-lg'
                      } flex items-center justify-center font-bold transition-all ${
                        program.completed
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {program.completed ? '✓' : programNumber}
                    </button>
                  </div>
                  <div className="flex-1">
                    {editingBasicId === program.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-gray-800"
                          placeholder="节目标题"
                        />
                        <input
                          type="text"
                          value={editPerformer}
                          onChange={(e) => setEditPerformer(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-gray-800 text-sm"
                          placeholder="表演者"
                        />
                        <input
                          type="number"
                          value={editOrder}
                          onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-1 border border-gray-300 rounded text-gray-800 text-sm"
                          placeholder="顺序"
                        />
                        <select
                          value={editParentId}
                          onChange={(e) => setEditParentId(e.target.value)}
                          className="w-48 px-3 py-1 border border-gray-300 rounded text-gray-800 text-sm"
                        >
                          <option value="">无（主节目）</option>
                          {getMainPrograms().filter(p => p.id !== program.id).map((p) => (
                            <option key={p.id} value={p.id}>
                              {getProgramNumber(p)}. {p.title}
                            </option>
                          ))}
                        </select>
                        {editParentId && (
                          <input
                            type="number"
                            value={editSubOrder}
                            onChange={(e) => setEditSubOrder(parseInt(e.target.value) || 1)}
                            className="w-24 px-3 py-1 border border-gray-300 rounded text-gray-800 text-sm"
                            placeholder="子序号"
                            min="1"
                          />
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveBasicInfo(program.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEditBasic}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3
                          className={`font-semibold text-lg ${
                            program.completed
                              ? 'text-green-700 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          表演者：{program.performer} | 顺序：{program.order}
                          {program.parentId && (
                            <span className="ml-2 text-blue-600">
                              (子节目 {program.subOrder})
                            </span>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditBasic(program)}
                      className="px-3 py-2 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-all"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => startEditInfo(program)}
                      className="px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-all"
                    >
                      📝 详情
                    </button>
                    <button
                      onClick={() => deleteProgram(program.id, program.title)}
                      className="px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-all"
                    >
                      🗑️ 删除
                    </button>
                    {program.completed && (
                      <span className="text-3xl">🎉</span>
                    )}
                  </div>
                </div>

                {/* 编辑详情面板 */}
                {editingId === program.id && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        节目详情（支持 Markdown 和数学公式）
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        💡 提示：<br/>
                        • 粗体：**文本** 或 __文本__<br/>
                        • 斜体：*文本* 或 _文本_<br/>
                        • 行内公式：$E=mc^2$<br/>
                        • 块级公式：$${'\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'}$$
                      </p>
                      <textarea
                        value={editInfo}
                        onChange={(e) => setEditInfo(e.target.value)}
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                        placeholder={`请输入节目详情，例如：
这是一个**精彩**的节目

表演时间：*20分钟*

数学之美：$\\pi \\approx 3.14159$

勾股定理：
$$a^2 + b^2 = c^2$$`}
                      />
                    </div>

                    {/* 预览区 */}
                    {editInfo && (
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          预览效果
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <MarkdownRenderer content={editInfo} />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveInfo(program.id)}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                      >
                        {saving ? '保存中...' : '💾 保存'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* 显示已有详情 */}
                {!editingId && program.info && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        📝 当前详情
                      </h4>
                      <MarkdownRenderer content={program.info} />
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
