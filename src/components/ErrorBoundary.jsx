import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 px-5">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4 opacity-30">
              <svg className="w-20 h-20 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.
            </p>
            <Link
              to="/"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white no-underline px-6 py-3 rounded-xl text-sm font-bold transition-colors"
              onClick={() => this.setState({ hasError: false })}
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
