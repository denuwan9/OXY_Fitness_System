const API_BASE_URL = 'http://localhost:6017/api/memberships';

// CREATE: Add new membership
export const createMembership = async (membershipData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membershipData)
  });
  if (!response.ok) throw new Error('Failed to create membership');
  return await response.json();
};

// READ: Get all memberships
export const getMemberships = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch memberships');
  return await response.json();
};

// UPDATE: Modify membership
export const updateMembership = async (id, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) throw new Error('Failed to update membership');
  return await response.json();
};

// DELETE: Remove membership
export const deleteMembership = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete membership');
  return await response.json();
};

// DOWNLOAD: Generate PDF
export const downloadPDF = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}/pdf`);
  if (!response.ok) throw new Error('Failed to generate PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `membership_${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};