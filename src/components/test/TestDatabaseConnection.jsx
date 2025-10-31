import React, { useState, useEffect } from "react";

// Datos simulados para pruebas
const mockUsers = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "passenger", createdAt: "2023-10-30T12:00:00Z" },
  { id: "2", name: "María López", email: "maria@example.com", role: "driver", createdAt: "2023-10-29T10:30:00Z" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com", role: "admin", createdAt: "2023-10-28T15:45:00Z" }
];

const TestDatabaseConnection = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "passenger" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ backend: false, database: false });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulamos una llamada a la API
      setTimeout(() => {
        setUsers(mockUsers);
        setConnectionStatus({ backend: true, database: true });
        setError(null);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Error al cargar usuarios: " + err.message);
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulamos una llamada a la API para crear un usuario
      setTimeout(() => {
        const newUserWithId = {
          id: Date.now().toString(),
          ...newUser,
          createdAt: new Date().toISOString()
        };
        setUsers([...users, newUserWithId]);
        setNewUser({ name: "", email: "", role: "passenger" });
        setError(null);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Error al crear usuario: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Verificar conexión con el backend
    fetch("http://localhost:3000/api/v1/health")
      .then(response => response.json())
      .then(data => {
        if (data.status === "ok") {
          setConnectionStatus(prev => ({ ...prev, backend: true }));
        }
      })
      .catch(() => {
        setConnectionStatus(prev => ({ ...prev, backend: false }));
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Prueba de Conexión a Base de Datos</h2>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Estado de Conexión</h3>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus.backend ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Backend: {connectionStatus.backend ? 'Conectado' : 'Desconectado'}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus.database ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Base de datos: {connectionStatus.database ? 'Conectada' : 'Desconectada'}</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p>Nota: Estamos usando datos simulados para esta demostración.</p>
        </div>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={createUser} className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Crear Nuevo Usuario</h3>
        <div className="mb-3">
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Rol:</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            className="border p-2 w-full rounded"
          >
            <option value="passenger">Pasajero</option>
            <option value="driver">Conductor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Usuario"}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Usuarios ({users.length})</h3>
        {loading && <p>Cargando...</p>}
        {users.length === 0 && !loading ? (
          <p>No hay usuarios registrados</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Rol</th>
                <th className="py-2 px-4 border-b">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TestDatabaseConnection;
