import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Join MarkAssist"
      subtitle="Create your account and start using our AI marketing assistant"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;