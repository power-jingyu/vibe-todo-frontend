import { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todoService'

function App() {
  const [todos, setTodos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quickInput, setQuickInput] = useState('')

  // 할일 목록 로드
  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const todosData = await getTodos()
      setTodos(todosData)
    } catch (error) {
      setError('할일 목록을 불러오는데 실패했습니다.')
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // 할일 추가
  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData)
      setTodos(prev => [newTodo, ...prev])
      setShowForm(false)
    } catch (error) {
      alert('할일 추가에 실패했습니다.')
    }
  }

  // 할일 수정
  const handleUpdateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await updateTodo(id, todoData)
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ))
      setEditingTodo(null)
    } catch (error) {
      alert('할일 수정에 실패했습니다.')
    }
  }

  // 할일 삭제
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo._id !== id))
    } catch (error) {
      alert('할일 삭제에 실패했습니다.')
    }
  }

  // 수정 모드 시작
  const handleEditTodo = (todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }

  // 폼 닫기
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTodo(null)
  }

  // 빠른 할일 추가
  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!quickInput.trim()) return

    try {
      const newTodo = await createTodo({
        title: quickInput.trim(),
        description: '',
        dueDate: '',
        priority: 'medium',
        completed: false
      })
      setTodos(prev => [newTodo, ...prev])
      setQuickInput('')
    } catch (error) {
      alert('할일 추가에 실패했습니다.')
    }
  }

  // 필터링된 할일 목록
  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>⚔️ 할일 관리</h1>
          
        </div>
        
      </header>

      {/* 빠른 할일 추가 */}
      <div className="quick-add-section">
        <form onSubmit={handleQuickAdd} className="quick-add-form">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="새로운 임무를 입력하세요..."
            className="quick-input"
          />
          <button type="submit" className="btn-quick-add">
            ⚔️ 추가
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading">
          <p>할일 목록을 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={loadTodos}>다시 시도</button>
        </div>
      )}

      {!loading && !error && (
        <main className="todo-container">
          <div className="todo-stats">
            <div className="stat-item">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">전체</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{pendingTodos.length}</span>
              <span className="stat-label">진행중</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completedTodos.length}</span>
              <span className="stat-label">완료</span>
            </div>
          </div>

          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⚔️</div>
              <p>아직 임무가 없습니다.</p>
              <p>새로운 전장의 임무를 추가해보세요!</p>
            </div>
          ) : (
            <div className="todo-list">
              {pendingTodos.map(todo => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
              {completedTodos.map(todo => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {showForm && (
        <TodoForm
          onSubmit={editingTodo ? 
            (data) => handleUpdateTodo(editingTodo._id, data) : 
            handleCreateTodo
          }
          initialData={editingTodo}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  )
}

export default App
