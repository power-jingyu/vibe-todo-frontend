import { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await onUpdate(todo._id, { ...todo, completed: !todo.completed });
    } catch (error) {
      alert('할일 상태 변경에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 할일을 삭제하시겠습니까?')) {
      try {
        await onDelete(todo._id);
      } catch (error) {
        alert('할일 삭제에 실패했습니다.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <h4 className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}>
            {todo.title}
          </h4>
          <div className="todo-priority" style={{ backgroundColor: getPriorityColor(todo.priority) }}>
            {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
          </div>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        {todo.dueDate && (
          <div className={`todo-due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
            마감일: {formatDate(todo.dueDate)}
          </div>
        )}

        <div className="todo-actions">
          <button
            className={`btn-toggle ${todo.completed ? 'btn-undo' : 'btn-complete'}`}
            onClick={handleToggleComplete}
          >
            {todo.completed ? '미완료로 변경' : '완료'}
          </button>
          <button className="btn-edit" onClick={handleEdit}>
            수정
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
