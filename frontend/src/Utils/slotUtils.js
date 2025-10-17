// Utility function to format slot IDs with S- prefix
export const formatSlotId = (id) => {
    if (typeof id === 'string' && id.startsWith('S-')) {
        return id; // Already formatted
    }
    return `S-${String(id).padStart(3, '0')}`;
};