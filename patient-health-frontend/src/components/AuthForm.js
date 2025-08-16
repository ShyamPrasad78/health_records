// src/components/AuthForm.jsx
export default function AuthForm({
  title,
  onSubmit,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  error,
  showEmail = false,
  buttonText = 'Login',
  linkText,
  linkAction,
  linkLabel,
}) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa',
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        {showEmail && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0277bd',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            marginTop: '10px',
          }}
        >
          {buttonText}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          {linkText}{' '}
          <button
            type="button"
            onClick={linkAction}
            style={{ background: 'none', border: 'none', color: '#0277bd', cursor: 'pointer' }}
          >
            {linkLabel}
          </button>
        </p>
      </form>
    </div>
  );
}

// Shared input style
const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px',
};