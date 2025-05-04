import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import MemberExercises from '../components/MemberExercises';

const MemberExercisesPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'member') {
    return (
      <Layout>
        <div>Unauthorized access</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MemberExercises memberId={user._id} />
    </Layout>
  );
};

export default MemberExercisesPage; 