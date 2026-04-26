import { OK, UNAUTHORIZED } from '@evershop/evershop/lib/util/httpStatus';
import { disconnectConnection } from '../../lib/anafComplianceRepository.js';
export default async function anafDisconnect(request, response) {
    var _a, _b, _c, _d;
    const adminUser = (_d = (_b = (_a = request.getCurrentUser) === null || _a === void 0 ? void 0 : _a.call(request)) !== null && _b !== void 0 ? _b : (_c = request.locals) === null || _c === void 0 ? void 0 : _c.user) !== null && _d !== void 0 ? _d : null;
    if (!(adminUser === null || adminUser === void 0 ? void 0 : adminUser.admin_user_id)) {
        response.status(UNAUTHORIZED);
        response.json({ error: { status: UNAUTHORIZED, message: 'Unauthorized' } });
        return;
    }
    await disconnectConnection('Disconnected from store settings.', adminUser.admin_user_id);
    response.status(OK);
    response.json({
        data: {
            success: true
        }
    });
}
//# sourceMappingURL=anafDisconnect.js.map