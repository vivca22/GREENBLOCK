/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";

// Configuración global
setGlobalOptions({maxInstances: 10});

// Chat functions
export {chat} from "./chat/chatFunction";

// Blockchain functions
export {deployContract} from "./blockchain/deployContract";
export {registerDegradation} from "./blockchain/registerDegradation";
export {getHistory} from "./blockchain/getHistory";

// Orders functions
export {createOrder} from "./orders/createOrder";
export {updateOrderStatus} from "./orders/updateOrderStatus";
export {getOrders} from "./orders/getOrders";

// Courses functions
export {getCourses} from "./courses/getCourses";
export {submitQuizAnswer} from "./courses/submitQuizAnswer";
export {completeCourse} from "./courses/completeCourse";

// GreenPoints functions
export {getBalance} from "./greenpoints/getBalance";
export {spendPoints} from "./greenpoints/spendPoints";
export {getTransactions} from "./greenpoints/getTransactions";

// Avatar functions
export {upgradeAvatar} from "./avatar/upgradeAvatar";

// Referrals functions
export {generateReferralCode} from "./referrals/generateReferralCode";
export {applyReferralCode} from "./referrals/applyReferralCode";
