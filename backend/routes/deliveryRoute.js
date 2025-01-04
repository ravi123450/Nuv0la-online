import express from "express";
import { updateDeliveryLocation, getDeliveryLocation } from "../controllers/deliveryController.js";

const router = express.Router();

// Update delivery location
router.post("/update-location", updateDeliveryLocation);

router.get("/update-location",updateDeliveryLocation)

// Get delivery location
router.get("/live-location", getDeliveryLocation);

router.post("/live-location",getDeliveryLocation)


export default router;
