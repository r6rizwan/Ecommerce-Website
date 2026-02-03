export const getSuperAdminToken = () => {
    return localStorage.getItem('superAdminToken');
};

export const setSuperAdminToken = (token) => {
    localStorage.setItem('superAdminToken', token);
};

export const removeSuperAdminToken = () => {
    localStorage.removeItem('superAdminToken');
};

export const superAdminAuthHeader = () => {
    const token = getSuperAdminToken();
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const adminAuthHeader = () => {
    const token = getAdminToken();
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};


export const getAdminToken = () => {
    return localStorage.getItem('adminToken');
};

export const setAdminToken = (token) => {
    localStorage.setItem('adminToken', token);
};

export const removeAdminToken = () => {
    localStorage.removeItem('adminToken');
};
