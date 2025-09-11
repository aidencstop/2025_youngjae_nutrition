import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import './styles/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.jsx';
import 'sweetalert2/dist/sweetalert2.min.css';  // ✅ 추가
import './styles/swal-overrides.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
