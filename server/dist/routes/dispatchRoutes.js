"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dispatchController_1 = require("../controllers/dispatchController");
const router = (0, express_1.Router)();
router.get('/recommend', dispatchController_1.getRecommendedTechnicians);
router.get('/technicians', dispatchController_1.getAllTechnicians);
exports.default = router;
