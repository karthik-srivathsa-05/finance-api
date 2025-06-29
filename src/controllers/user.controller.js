const User = require('../models/User.model');

//PUT /api/user/theme
// @access  Private
exports.updateTheme = async (req, res) => {
    const { theme } = req.body;

    if (!theme || !['light', 'dark'].includes(theme)) {
        return res.status(400).json({ msg: 'Invalid theme. Please provide "light" or "dark".' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { theme: theme } },
            { new: true } //return updated user document
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Theme updated successfully', theme: user.theme });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};