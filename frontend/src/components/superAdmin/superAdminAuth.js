export const getSuperAdminToken = () => {
    return localStorage.getItem('superAdminToken');
};

export const setSuperAdminToken = (token) => {
    localStorage.setItem('superAdminToken', token);
};

export const removeSuperAdminToken = () => {
    localStorage.removeItem('superAdminToken');
};

export const authHeader = () => {
    const token = getSuperAdminToken();
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};
