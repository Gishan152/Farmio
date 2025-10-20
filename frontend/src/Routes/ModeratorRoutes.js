// Moderator imports
import ModeratorLogin from '../Pages/moderator/Login';
import ModeratorDashboard from '../Pages/moderator/Dashboard';
import ModeratorPasswordChange from '../Pages/moderator/PasswordChange';
import ModeratorProducts from '../Pages/moderator/products/index';
import ModeratorProductReview from '../Pages/moderator/products/review';
import ModeratorProductQuality from '../Pages/moderator/products/quality';
import ModeratorOrders from '../Pages/moderator/orders/index';
import ModeratorSupport from '../Pages/moderator/support/index';
import ModeratorSettings from '../Pages/moderator/settings/index';
import ModeratorPricing from '../Pages/moderator/pricing/index';
import ModeratorPricingHistory from '../Pages/moderator/pricing/history';
import ModeratorPricingAnalytics from '../Pages/moderator/pricing/analytics';

const moderatorRoutes = // Add Moderator routes
{
    path: '/moderator',
    children: [
        {
            path: 'login',
            Component: ModeratorLogin
        },
        {
            path: 'password-change',
            Component: ModeratorPasswordChange
        },
        {
            path: 'dashboard',
            Component: ModeratorDashboard
        },
        {
            path: 'products',
            children: [
                {
                    index: true,
                    Component: ModeratorProducts
                },
                {
                    path: 'review',
                    Component: ModeratorProductReview
                },
                {
                    path: 'quality',
                    Component: ModeratorProductQuality
                }
            ]
        },
        {
            path: 'pricing',
            children: [
                {
                    index: true,
                    Component: ModeratorPricing
                },
                {
                    path: 'history',
                    Component: ModeratorPricingHistory
                },
                {
                    path: 'analytics',
                    Component: ModeratorPricingAnalytics
                }
            ]
        },
        {
            path: 'orders',
            Component: ModeratorOrders
        },
        {
            path: 'support',
            Component: ModeratorSupport
        },
        {
            path: 'settings',
            Component: ModeratorSettings
        }
    ]
}

export default moderatorRoutes;