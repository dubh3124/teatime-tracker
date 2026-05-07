function logBrew(type, label) {
    const brew = {
        type,
        label,
        timestamp: new Date().toISOString()
    };
    return brew;
}

module.exports = { logBrew };

