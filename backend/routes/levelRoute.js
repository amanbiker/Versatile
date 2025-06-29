const express = require("express");
const {
 createLevel,
 getLevelsPermittedToUsers,
 getAdminLevels,
 getAdminLevelsById,
 getLevelDetails,
 updateLevel,
 deleteLevel
} = require("../controllers/levelController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router = express.Router();

router.route("/permit-levels").get(isAuthenticatedUser, getLevelsPermittedToUsers);

router.route("/admin/selfproducts/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getAdminLevelsById);

router
  .route("/admin/new-level")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createLevel);

router
  .route("/admin/level/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminLevels);

router
  .route("/admin/level/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateLevel)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteLevel);

router.route("/level/:id").get(isAuthenticatedUser, getLevelDetails);


module.exports = router;
