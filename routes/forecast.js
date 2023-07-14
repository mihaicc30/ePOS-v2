require("dotenv").config();
const router = require("express").Router();
const tf = require("@tensorflow/tfjs");

// cloudy 0 - 100
// humidity 0 - 100
// windSpeed 0-50

// temperature -40 to +40

// day ranging from Monday 0 to Sunday 6
// isHoliday true 1/false 0

// sales 0 - 100000
// business level 0 - 100

router.post("/forecast", async (req, res) => {
  const { cloudy, humidity, windspeed, temp, daytype, isholiday } = req.body;
  let data = []

  data.push([cloudy, humidity, windspeed, temp, daytype, isholiday]);
 
  
  // Define the training data
  const trainingData = [
    [6, 28, 3, 20, 0, 0],
    [44, 32, 8, 11, 5, 0],
    [53, 77, 16, 5, 2, 0],
    [18, 84, 5, 37, 4, 0],
    [70, 69, 19, 6, 4, 0],
    [55, 34, 7, 8, 5, 0],
    [84, 93, 5, 8, 2, 0],
    [47, 89, 8, 10, 2, 0],
    [92, 48, 6, 9, 2, 0],
    [76, 93, 13, 11, 4, 0],
    [1, 91, 1, 26, 1, 0],
    [50, 82, 13, 8, 3, 0],
    [2, 31, 5, 33, 5, 0],
    [37, 1, 3, 8, 5, 0],
    [47, 2, 6, 11, 1, 0],
    [81, 7, 18, 10, 4, 0],
    [65, 12, 12, 12, 5, 0],
    [61, 50, 18, 7, 5, 0],
    [48, 2, 16, 9, 5, 0],
    [78, 43, 12, 7, 0, 0],
    [51, 10, 11, 11, 5, 1],
    [79, 89, 18, 12, 6, 0],
    [62, 71, 16, 10, 5, 0],
    [49, 21, 16, 5, 3, 0],
    [31, 43, 5, 8, 4, 1],
    [75, 48, 18, 5, 4, 1],
    [43, 47, 8, 3, 1, 0],
    [26, 38, 2, 11, 5, 0],
    [20, 67, 2, 38, 3, 0],
    [80, 52, 5, 4, 2, 0],
    [58, 19, 10, 7, 1, 0],
    [18, 95, 4, 24, 6, 0],
    [72, 61, 14, 7, 0, 0],
    [62, 15, 12, 4, 2, 0],
    [76, 50, 19, 10, 6, 0],
    [86, 50, 9, 12, 0, 1],
    [80, 91, 10, 8, 6, 0],
    [6, 11, 2, 39, 4, 0],
    [65, 20, 8, 3, 3, 0],
    [97, 23, 16, 8, 4, 0],
    [23, 81, 5, 39, 5, 0],
    [31, 76, 1, 4, 3, 0],
    [20, 4, 2, 22, 5, 0],
    [85, 53, 10, 11, 6, 0],
    [83, 11, 12, 11, 6, 0],
    [69, 11, 5, 9, 5, 0],
    [54, 9, 16, 5, 2, 0],
    [43, 72, 12, 7, 3, 0],
    [80, 76, 10, 8, 2, 0],
    [85, 76, 6, 11, 4, 0],
    [85, 12, 8, 8, 0, 0],
    [33, 28, 2, 9, 4, 0],
    [93, 12, 11, 5, 5, 1],
    [25, 7, 3, 30, 2, 0],
    [18, 28, 2, 24, 4, 0],
    [22, 72, 1, 33, 0, 0],
    [65, 11, 17, 6, 1, 0],
    [26, 81, 2, 12, 4, 0],
    [94, 54, 13, 3, 1, 0],
    [77, 28, 14, 7, 5, 0],
    [89, 78, 7, 4, 6, 0],
    [1, 79, 5, 24, 5, 0],
    [3, 83, 2, 36, 6, 0],
    [39, 40, 1, 6, 0, 0],
    [30, 85, 2, 10, 0, 0],
    [26, 58, 3, 20, 1, 0],
    [1, 63, 3, 35, 1, 0],
    [61, 70, 9, 3, 0, 0],
    [46, 78, 5, 6, 1, 0],
    [26, 80, 4, 15, 2, 0],
    [51, 40, 8, 8, 1, 0],
    [34, 35, 1, 5, 1, 0],
    [80, 9, 18, 12, 5, 0],
    [45, 52, 11, 10, 4, 1],
    [49, 43, 11, 11, 5, 0],
    [50, 71, 14, 3, 0, 1],
    [89, 64, 6, 11, 1, 0],
    [25, 42, 1, 32, 6, 0],
    [76, 55, 9, 5, 6, 0],
    [46, 10, 11, 10, 2, 0],
    [66, 95, 14, 10, 5, 0],
    [63, 68, 7, 3, 6, 0],
    [39, 50, 3, 11, 6, 0],
    [62, 54, 7, 7, 0, 0],
    [24, 79, 3, 29, 6, 0],
    [16, 78, 2, 22, 4, 0],
    [13, 5, 2, 25, 3, 0],
    [64, 35, 12, 9, 3, 0],
    [90, 13, 16, 11, 1, 0],
    [25, 34, 4, 27, 4, 0],
    [2, 71, 1, 34, 5, 0],
    [92, 11, 18, 9, 3, 0],
    [46, 31, 6, 7, 3, 0],
    [70, 57, 18, 12, 2, 0],
    [63, 82, 17, 8, 1, 0],
    [95, 8, 14, 9, 1, 0],
    [48, 7, 18, 11, 1, 0],
    [64, 21, 18, 9, 1, 0],
    [80, 23, 6, 12, 6, 1],
    [98, 43, 13, 7, 3, 0],
    [79, 12, 11, 6, 3, 0],
    [51, 75, 6, 6, 4, 1],
    [53, 63, 12, 11, 5, 0],
    [62, 91, 6, 3, 3, 0],
    [76, 49, 18, 11, 2, 0],
    [86, 4, 12, 3, 2, 0],
    [84, 89, 14, 10, 0, 0],
    [84, 26, 19, 5, 0, 0],
    [59, 66, 17, 6, 0, 0],
    [32, 92, 1, 10, 2, 0],
    [92, 39, 5, 8, 1, 0],
    [33, 90, 3, 5, 1, 0],
    [8, 76, 3, 22, 5, 0],
    [55, 62, 15, 6, 5, 0],
    [33, 86, 2, 5, 5, 0],
    [10, 47, 4, 20, 2, 0],
    [64, 81, 15, 7, 3, 0],
    [72, 5, 8, 10, 6, 0],
    [40, 78, 5, 5, 3, 0],
    [82, 17, 7, 10, 4, 0],
    [22, 18, 2, 34, 0, 0],
    [22, 3, 4, 28, 1, 0],
    [70, 19, 19, 3, 3, 0],
    [63, 10, 15, 9, 3, 0],
    [5, 15, 1, 35, 6, 0],
    [81, 72, 9, 6, 4, 0],
    [31, 5, 2, 12, 4, 0],
    [20, 30, 2, 29, 3, 0],
    [9, 99, 2, 24, 5, 0],
    [50, 90, 12, 6, 0, 0],
    [4, 55, 5, 39, 1, 0],
    [37, 25, 2, 9, 4, 0],
    [52, 85, 10, 8, 1, 0],
    [25, 8, 4, 24, 4, 1],
    [45, 77, 5, 4, 4, 0],
    [17, 23, 4, 35, 1, 0],
    [40, 7, 3, 5, 6, 0],
    [86, 89, 8, 11, 5, 1],
    [18, 33, 2, 25, 5, 0],
    [26, 50, 3, 18, 0, 1],
    [80, 86, 7, 7, 1, 0],
    [26, 76, 2, 15, 0, 0],
    [87, 15, 10, 5, 1, 0],
    [63, 14, 10, 3, 4, 1],
    [84, 48, 14, 9, 4, 0],
    [86, 50, 5, 5, 4, 0],
    [7, 24, 4, 23, 3, 0],
    [7, 2, 4, 23, 0, 0],
    [91, 9, 13, 4, 2, 0],
    [67, 83, 15, 10, 2, 0],
    [67, 92, 8, 10, 3, 0],
    [5, 16, 5, 25, 2, 0],
    [18, 59, 2, 24, 0, 0],
    [38, 23, 3, 5, 6, 0],
    [10, 85, 4, 34, 3, 0],
    [16, 95, 2, 33, 6, 0],
    [48, 6, 5, 11, 6, 0],
    [58, 62, 10, 7, 4, 0],
    [25, 76, 2, 22, 6, 0],
    [55, 81, 11, 7, 5, 0],
    [59, 6, 14, 8, 3, 0],
    [35, 49, 3, 10, 5, 0],
    [21, 3, 3, 35, 0, 0],
    [42, 12, 9, 9, 3, 0],
    [59, 47, 9, 10, 6, 0],
    [33, 41, 3, 10, 3, 0],
    [4, 77, 3, 26, 5, 1],
    [58, 13, 7, 3, 3, 0],
    [19, 60, 3, 36, 0, 1],
    [89, 93, 15, 6, 5, 1],
    [70, 69, 14, 11, 6, 1],
    [58, 32, 6, 8, 3, 0],
    [53, 2, 12, 6, 1, 0],
    [43, 46, 18, 6, 6, 0],
    [55, 37, 14, 10, 1, 0],
    [85, 52, 12, 4, 2, 0],
    [61, 91, 7, 11, 6, 1],
    [96, 27, 5, 6, 3, 0],
    [61, 15, 10, 7, 5, 0],
    [79, 86, 14, 7, 1, 0],
    [13, 58, 5, 23, 4, 0],
    [87, 99, 5, 8, 6, 0],
    [65, 52, 10, 9, 6, 0],
    [44, 48, 8, 4, 3, 0],
    [62, 19, 7, 10, 5, 0],
    [10, 16, 1, 27, 4, 1],
    [38, 60, 5, 3, 5, 0],
    [12, 51, 2, 27, 0, 0],
    [62, 71, 5, 12, 0, 0],
    [29, 18, 1, 11, 0, 1],
    [76, 57, 9, 7, 1, 0],
    [11, 84, 5, 29, 6, 0],
    [21, 47, 3, 22, 1, 0],
    [15, 11, 4, 31, 4, 0],
    [52, 66, 8, 5, 6, 1],
    [31, 23, 2, 8, 3, 0],
    [90, 83, 8, 6, 4, 0],
    [71, 49, 12, 12, 5, 0],
    [88, 54, 16, 9, 4, 0],
    [20, 69, 5, 37, 5, 0],
    [16, 97, 3, 31, 5, 1],
    [45, 39, 8, 5, 3, 0],
    [81, 78, 16, 12, 1, 0],
    [53, 58, 6, 4, 4, 0],
    [79, 7, 15, 4, 5, 0],
    [26, 11, 3, 11, 1, 0],
    [57, 77, 16, 10, 0, 0],
    [3, 19, 2, 31, 5, 0],
    [90, 17, 6, 5, 0, 0],
    [34, 30, 1, 12, 6, 0],
    [71, 26, 15, 9, 6, 0],
    [67, 66, 16, 7, 0, 1],
    [78, 74, 16, 9, 5, 0],
    [11, 41, 2, 29, 0, 1],
    [44, 63, 8, 4, 1, 0],
    [79, 86, 7, 3, 3, 0],
    [2, 27, 3, 33, 0, 0],
    [59, 12, 12, 3, 2, 0],
    [13, 94, 2, 32, 1, 0],
    [20, 90, 1, 33, 6, 0],
    [91, 10, 6, 6, 1, 0],
    [65, 48, 18, 12, 0, 0],
    [3, 80, 4, 35, 3, 0],
    [44, 29, 19, 8, 2, 0],
    [34, 88, 2, 3, 5, 0],
    [1, 7, 3, 30, 1, 0],
    [54, 4, 15, 11, 4, 1],
    [85, 21, 7, 10, 4, 0],
    [58, 86, 10, 11, 3, 0],
    [69, 51, 15, 5, 5, 1],
    [19, 36, 5, 27, 4, 0],
    [39, 55, 3, 10, 0, 0],
    [60, 12, 5, 4, 1, 0],
    [29, 17, 1, 19, 4, 0],
    [19, 53, 2, 22, 3, 0],
    [65, 97, 18, 6, 3, 0],
    [60, 8, 17, 6, 0, 0],
    [78, 83, 18, 4, 3, 0],
    [34, 75, 5, 9, 6, 0],
    [59, 81, 8, 11, 3, 0],
    [44, 3, 14, 12, 5, 0],
    [67, 47, 7, 4, 4, 1],
    [29, 93, 3, 13, 1, 0],
    [98, 99, 6, 4, 5, 0],
    [73, 59, 7, 7, 1, 0],
    [57, 63, 15, 3, 0, 0],
    [77, 19, 16, 6, 1, 0],
    [48, 34, 7, 4, 1, 0],
    [17, 52, 3, 32, 3, 0],
    [10, 17, 3, 33, 0, 0],
    [44, 65, 11, 7, 4, 0],
    [26, 41, 2, 19, 1, 0],
    [36, 82, 4, 7, 4, 0],
    [73, 56, 11, 5, 0, 0],
    [51, 10, 15, 10, 3, 0],
    [83, 76, 8, 12, 2, 0],
    [87, 82, 8, 9, 0, 1],
    [10, 42, 1, 33, 2, 0],
    [97, 87, 5, 11, 1, 0],
    [7, 45, 3, 35, 5, 1],
    [52, 65, 5, 6, 6, 0],
    [13, 14, 1, 39, 0, 0],
    [23, 80, 3, 39, 3, 0],
    [23, 64, 1, 33, 5, 0],
    [76, 17, 10, 4, 2, 0],
    [78, 40, 17, 5, 3, 0],
    [94, 33, 5, 11, 4, 1],
    [39, 55, 5, 10, 3, 0],
    [4, 48, 4, 26, 0, 0],
    [35, 6, 4, 8, 2, 0],
    [86, 66, 15, 11, 6, 0],
    [26, 64, 3, 13, 5, 0],
    [66, 85, 14, 11, 6, 1],
    [48, 23, 11, 7, 0, 0],
    [19, 90, 3, 23, 4, 0],
    [41, 55, 9, 9, 6, 0],
    [32, 99, 2, 9, 2, 0],
    [57, 21, 18, 9, 3, 0],
    [86, 53, 13, 9, 3, 0],
    [13, 11, 5, 24, 1, 0],
    [66, 97, 14, 10, 4, 0],
    [51, 99, 9, 7, 0, 1],
    [81, 57, 7, 4, 5, 0],
    [7, 32, 3, 35, 0, 0],
    [28, 96, 2, 14, 5, 0],
    [6, 67, 3, 33, 0, 0],
    [12, 40, 2, 25, 4, 0],
    [92, 58, 14, 10, 4, 0],
    [60, 50, 19, 8, 6, 0],
    [32, 8, 2, 10, 5, 0],
    [82, 57, 7, 8, 1, 0],
    [90, 85, 13, 7, 4, 0],
    [29, 75, 2, 17, 0, 0],
    [72, 87, 14, 8, 2, 0],
    [6, 81, 1, 25, 0, 0],
    [74, 61, 15, 12, 1, 0],
    [74, 72, 6, 3, 4, 0],
    [85, 99, 15, 4, 3, 0],
    [26, 64, 2, 20, 1, 0],
    [95, 30, 12, 7, 3, 0],
    [15, 2, 5, 39, 2, 0],
    [48, 84, 14, 9, 3, 0],
    [36, 52, 4, 12, 3, 0],
    [79, 9, 17, 12, 0, 0],
    [3, 95, 5, 27, 5, 0],
    [23, 50, 5, 25, 0, 0],
    [31, 59, 1, 5, 1, 0],
    [11, 8, 1, 23, 2, 0],
    [71, 55, 14, 9, 4, 0],
    [68, 15, 5, 6, 1, 0],
    [8, 80, 4, 26, 4, 0],
    [12, 35, 3, 24, 1, 0],
    [51, 2, 6, 11, 5, 1],
    [77, 38, 12, 10, 1, 0],
    [79, 48, 17, 8, 4, 0],
    [80, 97, 18, 10, 4, 0],
    [58, 32, 10, 6, 0, 0],
    [80, 10, 12, 7, 6, 0],
    [88, 16, 12, 5, 5, 0],
    [21, 76, 3, 35, 0, 1],
    [97, 81, 11, 3, 2, 0],
    [12, 2, 4, 31, 3, 0],
    [86, 28, 8, 7, 1, 0],
    [84, 37, 5, 9, 0, 1],
    [95, 15, 11, 5, 0, 0],
    [86, 35, 8, 9, 1, 0],
    [27, 79, 2, 15, 3, 0],
    [13, 90, 4, 27, 2, 0],
    [50, 11, 5, 10, 2, 0],
    [74, 67, 7, 9, 0, 0],
    [61, 36, 11, 10, 1, 0],
    [70, 63, 14, 7, 2, 0],
    [55, 89, 6, 10, 3, 0],
    [51, 37, 18, 9, 0, 0],
    [22, 64, 2, 24, 4, 1],
    [4, 83, 2, 25, 1, 0],
    [38, 56, 1, 12, 5, 0],
    [40, 58, 4, 4, 0, 0],
    [38, 37, 2, 11, 2, 0],
    [60, 7, 6, 9, 4, 0],
    [78, 83, 5, 7, 3, 0],
    [7, 20, 1, 34, 0, 1],
    [83, 76, 18, 6, 1, 0],
    [95, 15, 18, 8, 1, 0],
    [69, 22, 12, 4, 5, 0],
    [84, 29, 5, 12, 4, 1],
    [79, 63, 17, 9, 3, 0],
    [42, 48, 15, 10, 3, 0],
    [4, 35, 5, 23, 6, 0],
    [99, 92, 19, 8, 3, 0],
    [16, 65, 2, 36, 6, 0],
    [98, 37, 14, 8, 5, 1],
    [68, 11, 8, 9, 5, 1],
    [63, 64, 7, 8, 3, 0],
    [69, 10, 14, 6, 4, 0],
    [86, 77, 11, 8, 2, 0],
    [23, 18, 4, 24, 1, 0],
    [60, 7, 15, 7, 4, 1],
    [15, 20, 1, 30, 6, 0],
    [98, 98, 17, 5, 1, 0],
    [7, 73, 5, 22, 4, 0],
    [83, 97, 7, 12, 0, 0],
    [59, 66, 11, 12, 4, 0],
    [63, 54, 13, 9, 3, 0],
    [9, 52, 5, 36, 4, 0],
    [7, 69, 1, 31, 5, 0],
    [38, 55, 3, 8, 3, 0],
    [82, 22, 9, 4, 5, 0],
    [64, 6, 7, 8, 1, 0],
    [34, 65, 5, 7, 0, 0],
    [97, 43, 11, 11, 3, 0],
    [56, 16, 14, 7, 6, 0],
    [60, 45, 6, 10, 0, 0],
    [25, 45, 1, 22, 2, 0],
    [43, 60, 12, 8, 1, 0],
    [54, 43, 13, 9, 0, 1],
    [69, 79, 11, 10, 6, 0],
    [30, 91, 2, 11, 3, 0],
    [24, 61, 5, 33, 3, 0],
    [51, 92, 15, 3, 0, 0],
    [17, 52, 2, 20, 2, 0],
    [85, 56, 18, 12, 4, 0],
    [36, 91, 3, 12, 1, 0],
    [77, 23, 18, 4, 5, 1],
    [89, 40, 16, 3, 4, 0],
    [91, 21, 7, 11, 2, 0],
    [74, 18, 8, 10, 6, 0],
    [48, 34, 19, 7, 4, 0],
    [1, 84, 1, 37, 4, 1],
    [15, 69, 2, 27, 3, 0],
    [37, 41, 2, 3, 3, 0],
    [5, 94, 3, 28, 3, 0],
    [40, 86, 1, 11, 6, 0],
    [29, 72, 2, 15, 3, 0],
    [84, 97, 6, 5, 6, 0],
    [40, 75, 2, 5, 2, 0],
    [20, 77, 5, 20, 5, 0],
    [91, 31, 9, 3, 5, 0],
    [55, 53, 16, 3, 1, 0],
    [96, 1, 9, 12, 0, 0],
    [87, 80, 12, 11, 6, 0],
    [96, 71, 9, 6, 0, 1],
    [82, 94, 7, 5, 5, 0],
    [41, 8, 7, 3, 1, 0],
    [1, 93, 4, 28, 5, 1],
    [44, 18, 17, 9, 0, 0],
    [38, 75, 4, 4, 5, 0],
    [60, 49, 11, 5, 1, 0],
    [29, 56, 3, 17, 6, 0],
    [78, 55, 15, 8, 2, 0],
    [78, 44, 7, 10, 2, 0],
    [7, 47, 2, 22, 0, 0],
    [59, 76, 8, 12, 5, 0],
    [98, 92, 7, 8, 4, 0],
    [13, 18, 4, 37, 2, 0],
    [40, 49, 5, 11, 3, 0],
    [34, 89, 3, 9, 5, 0],
    [68, 9, 6, 4, 6, 1],
    [90, 19, 14, 12, 0, 0],
    [63, 56, 14, 6, 1, 0],
    [63, 45, 6, 5, 2, 0],
    [13, 53, 2, 29, 4, 0],
    [14, 19, 3, 22, 1, 0],
    [32, 92, 3, 7, 1, 0],
    [86, 8, 6, 4, 6, 0],
    [50, 19, 5, 12, 0, 1],
    [8, 94, 1, 20, 0, 0],
    [99, 92, 9, 5, 5, 1],
    [77, 77, 14, 3, 4, 0],
    [12, 39, 4, 28, 3, 0],
    [52, 11, 9, 4, 1, 0],
    [44, 56, 18, 10, 6, 0],
    [27, 36, 5, 13, 4, 0],
    [79, 16, 11, 4, 5, 0],
    [58, 8, 17, 11, 4, 0],
    [10, 52, 2, 30, 4, 1],
    [72, 82, 19, 8, 3, 0],
    [22, 15, 3, 20, 2, 0],
    [90, 23, 10, 8, 2, 0],
    [29, 73, 2, 11, 1, 0],
    [50, 20, 7, 6, 4, 0],
    [56, 51, 18, 6, 2, 0],
    [78, 70, 12, 10, 6, 0],
    [64, 8, 18, 7, 3, 0],
    [19, 41, 3, 29, 4, 0],
    [6, 45, 4, 32, 2, 0],
    [47, 2, 16, 12, 2, 0],
    [64, 73, 5, 7, 5, 0],
    [81, 35, 12, 12, 1, 0],
    [23, 92, 5, 34, 0, 1],
    [74, 84, 14, 5, 1, 0],
    [50, 32, 7, 5, 2, 0],
    [2, 83, 4, 36, 6, 0],
    [54, 66, 19, 4, 1, 0],
    [63, 53, 11, 6, 5, 0],
    [61, 93, 5, 7, 0, 0],
    [68, 89, 9, 4, 6, 0],
    [37, 41, 3, 9, 4, 0],
    [98, 39, 8, 3, 0, 1],
    [55, 74, 6, 11, 2, 0],
    [62, 34, 8, 11, 3, 0],
    [15, 24, 1, 28, 5, 0],
    [49, 1, 5, 11, 6, 1],
    [14, 46, 3, 34, 2, 0],
    [61, 91, 7, 9, 4, 0],
    [65, 2, 8, 12, 5, 0],
    [25, 97, 1, 23, 2, 0],
    [36, 93, 2, 5, 0, 0],
    [73, 34, 16, 9, 5, 0],
    [91, 31, 7, 7, 4, 0],
    [74, 30, 6, 4, 5, 0],
    [58, 15, 16, 12, 6, 0],
    [30, 98, 3, 3, 3, 0],
    [73, 72, 16, 4, 6, 0],
    [93, 2, 8, 7, 5, 0],
    [83, 28, 9, 6, 2, 0],
    [86, 52, 18, 9, 6, 0],
    [99, 1, 6, 6, 1, 0],
    [97, 86, 10, 5, 2, 0],
    [15, 68, 5, 39, 4, 0],
    [19, 23, 1, 33, 2, 0],
    [11, 72, 3, 27, 4, 0],
    [30, 77, 2, 9, 0, 0],
    [3, 75, 3, 28, 5, 0],
    [28, 99, 5, 13, 2, 0],
    [34, 38, 1, 12, 6, 0],
    [20, 4, 4, 33, 5, 0],
    [25, 56, 2, 37, 6, 0],
    [38, 34, 4, 7, 0, 0],
    [45, 13, 12, 10, 1, 0],
    [7, 94, 1, 36, 2, 0],
    [44, 3, 11, 9, 5, 0],
    [43, 88, 16, 12, 2, 0],
    [10, 26, 5, 22, 0, 0],
    [53, 45, 9, 4, 5, 1],
    [1, 41, 3, 27, 6, 1],
    [37, 48, 3, 3, 1, 0],
    [22, 71, 4, 24, 5, 0],
    [7, 51, 3, 26, 3, 0],
    [30, 63, 3, 9, 1, 0],
  ];
  const targetData = [
    [6298.4],
    [3865.92],
    [1823.11],
    [1416.0],
    [595.2],
    [2492.16],
    [1870.22],
    [1248.0],
    [1902.67],
    [608.0],
    [3980.0],
    [2099.11],
    [2629.44],
    [2935.68],
    [1274.4],
    [3364.8],
    [4354.56],
    [664.0],
    [1770.24],
    [461.78],
    [4031.42],
    [954.88],
    [1797.33],
    [1464.0],
    [4814.4],
    [1855.68],
    [1429.33],
    [7385.28],
    [3623.56],
    [2130.22],
    [1500.8],
    [2687.36],
    [583.11],
    [1336.0],
    [1511.68],
    [1463.2],
    [2122.24],
    [2419.2],
    [1027.2],
    [4228.8],
    [1546.13],
    [2807.11],
    [8608.32],
    [867.2],
    [2511.36],
    [1017.6],
    [876.8],
    [984.89],
    [732.89],
    [1387.2],
    [2938.4],
    [5080.32],
    [7952.26],
    [3935.2],
    [6408.96],
    [3438.67],
    [881.6],
    [3742.4],
    [1172.44],
    [2449.92],
    [3159.04],
    [3678.4],
    [2797.44],
    [2424.0],
    [2632.89],
    [1510.67],
    [2059.11],
    [2174.22],
    [1570.22],
    [1744.0],
    [2886.67],
    [6470.4],
    [1799.04],
    [1326.72],
    [2202.13],
    [2893.6],
    [734.67],
    [3125.12],
    [879.36],
    [2836.8],
    [975.47],
    [1497.6],
    [2126.08],
    [1584.0],
    [4501.12],
    [4110.93],
    [4035.2],
    [1607.2],
    [1691.2],
    [3480.96],
    [1259.73],
    [2577.6],
    [1211.2],
    [1087.11],
    [1294.22],
    [3338.4],
    [3380.0],
    [1666.4],
    [8315.14],
    [1115.56],
    [3421.6],
    [1425.6],
    [1363.73],
    [1794.22],
    [1012.0],
    [3568.8],
    [2059.56],
    [2665.6],
    [1140.0],
    [2797.33],
    [3620.0],
    [1812.44],
    [1921.6],
    [765.87],
    [1869.33],
    [2200.0],
    [1522.67],
    [4301.57],
    [508.89],
    [2271.36],
    [3984.8],
    [3242.4],
    [3770.4],
    [1762.4],
    [2926.08],
    [1752.0],
    [2387.52],
    [3693.6],
    [2091.2],
    [1368.0],
    [3440.89],
    [6541.44],
    [552.44],
    [12970.37],
    [859.2],
    [5348.0],
    [4859.14],
    [3737.28],
    [2590.08],
    [4215.2],
    [2202.67],
    [2964.89],
    [3807.2],
    [5616.0],
    [1137.07],
    [2379.73],
    [4640.0],
    [2772.8],
    [1695.2],
    [736.0],
    [915.56],
    [5796.0],
    [3766.22],
    [7114.75],
    [2922.22],
    [2977.28],
    [4341.89],
    [2083.2],
    [2431.36],
    [1277.33],
    [3954.4],
    [1161.6],
    [4007.2],
    [926.4],
    [2478.08],
    [3503.11],
    [6442.56],
    [2291.2],
    [6306.4],
    [2321.28],
    [5590.66],
    [3912.0],
    [3782.4],
    [1514.24],
    [2908.8],
    [867.11],
    [3820.03],
    [3917.6],
    [1558.08],
    [871.11],
    [3425.07],
    [2238.08],
    [2035.84],
    [1186.67],
    [3593.28],
    [4796.93],
    [4619.2],
    [1200.89],
    [1880.44],
    [11979.36],
    [471.11],
    [3712.0],
    [3146.22],
    [6503.04],
    [2109.31],
    [2140.8],
    [736.0],
    [2411.2],
    [982.93],
    [2931.73],
    [8517.12],
    [2207.2],
    [1339.11],
    [2406.4],
    [3229.44],
    [4271.2],
    [895.56],
    [8621.76],
    [1259.2],
    [4098.82],
    [3806.21],
    [3882.4],
    [2506.13],
    [5286.4],
    [1019.11],
    [1398.22],
    [1888.8],
    [3950.4],
    [3008.89],
    [2876.16],
    [1496.0],
    [446.67],
    [1473.33],
    [3544.8],
    [3797.33],
    [4903.2],
    [6274.37],
    [2454.72],
    [1931.11],
    [2958.72],
    [4224.0],
    [1677.33],
    [3112.8],
    [7628.16],
    [1696.0],
    [958.22],
    [2410.4],
    [1573.78],
    [2993.92],
    [1331.56],
    [1098.24],
    [4451.52],
    [3774.22],
    [1727.47],
    [1776.44],
    [625.78],
    [2833.6],
    [3599.2],
    [2065.78],
    [4269.6],
    [706.67],
    [2354.67],
    [1265.07],
    [1662.67],
    [1773.6],
    [560.89],
    [3584.0],
    [3600.44],
    [852.89],
    [4912.32],
    [2961.92],
    [4482.4],
    [968.44],
    [2493.87],
    [3643.2],
    [2173.33],
    [3004.99],
    [3781.33],
    [3420.0],
    [6752.8],
    [1502.72],
    [2355.2],
    [5013.5],
    [945.6],
    [1179.73],
    [970.24],
    [1697.33],
    [2946.4],
    [1129.78],
    [4522.4],
    [1865.07],
    [3915.2],
    [2564.27],
    [3144.0],
    [2878.93],
    [1435.11],
    [3621.6],
    [1689.07],
    [2100.48],
    [2098.56],
    [1157.78],
    [950.4],
    [2854.22],
    [2080.0],
    [3494.22],
    [1320.89],
    [894.93],
    [1950.67],
    [3984.0],
    [1645.6],
    [3394.4],
    [1838.67],
    [1984.89],
    [2072.0],
    [2979.73],
    [3780.0],
    [3266.22],
    [5503.2],
    [1116.8],
    [2336.8],
    [4077.33],
    [6959.2],
    [5446.66],
    [2656.0],
    [1969.6],
    [1010.13],
    [1760.0],
    [4245.12],
    [4139.52],
    [4840.8],
    [1841.78],
    [2888.8],
    [1170.4],
    [6357.6],
    [2061.6],
    [1776.8],
    [2405.78],
    [1680.89],
    [3603.2],
    [770.67],
    [1546.4],
    [1669.33],
    [987.11],
    [1137.6],
    [5593.92],
    [3743.56],
    [4712.0],
    [1194.67],
    [5078.4],
    [3191.04],
    [1643.56],
    [12719.52],
    [624.0],
    [2325.6],
    [2799.36],
    [7141.82],
    [1944.0],
    [1802.22],
    [9613.44],
    [1440.89],
    [1992.32],
    [1783.3],
    [2365.63],
    [756.89],
    [3888.96],
    [1553.78],
    [1823.2],
    [4682.88],
    [4055.04],
    [1808.0],
    [4786.67],
    [532.89],
    [1564.27],
    [1133.78],
    [2770.67],
    [3602.67],
    [2640.89],
    [1326.72],
    [2274.4],
    [3534.67],
    [967.11],
    [3273.98],
    [1685.78],
    [892.89],
    [1422.22],
    [2932.0],
    [2584.32],
    [2665.33],
    [2976.89],
    [697.78],
    [2779.11],
    [2225.6],
    [3487.56],
    [3825.79],
    [2278.4],
    [2244.0],
    [3655.3],
    [4533.12],
    [7067.52],
    [2492.0],
    [1849.78],
    [2809.78],
    [1688.96],
    [1461.33],
    [1403.52],
    [1002.67],
    [2218.13],
    [3000.96],
    [1517.33],
    [3785.6],
    [1923.84],
    [3564.8],
    [1090.13],
    [3036.8],
    [5616.0],
    [2485.6],
    [2317.87],
    [805.33],
    [2984.96],
    [1136.44],
    [1764.44],
    [1174.22],
    [1353.07],
    [1248.0],
    [6630.4],
    [748.44],
    [1166.93],
    [7581.08],
    [1672.0],
    [1853.78],
    [921.33],
    [4334.4],
    [4740.8],
    [1320.89],
    [4879.87],
    [7014.24],
    [1109.78],
    [2574.72],
    [2630.4],
    [6947.2],
    [1332.8],
    [1379.84],
    [1944.0],
    [3702.72],
    [2982.72],
    [5360.64],
    [1791.56],
    [6025.6],
    [940.8],
    [2772.89],
    [4649.28],
    [2065.33],
    [1301.12],
    [1263.2],
    [3434.13],
    [3037.78],
    [1414.4],
    [2298.67],
    [2386.4],
    [4628.0],
    [1087.11],
    [1175.2],
    [5388.16],
    [1278.22],
    [2379.2],
    [2003.56],
    [848.0],
    [1966.4],
    [2748.96],
    [1519.11],
    [1804.8],
    [3860.16],
    [4725.73],
    [2296.44],
    [1551.47],
    [3387.84],
    [2638.22],
    [2355.11],
    [3975.36],
    [4211.52],
    [1402.56],
    [2351.23],
    [1359.11],
    [1658.24],
    [4432.32],
    [3244.8],
    [1447.68],
    [3249.6],
    [1586.67],
    [2883.73],
    [3714.4],
    [3010.67],
    [2090.67],
    [1251.73],
    [3322.67],
    [4950.14],
    [7464.0],
    [4729.6],
    [1921.6],
    [929.6],
    [965.78],
    [4058.88],
    [1038.22],
    [3505.6],
    [1889.28],
    [7378.56],
    [1842.22],
    [1613.87],
    [3138.22],
    [2833.33],
  ];
  // Create a sequential model
  const model = tf.sequential();

  // Add a dense layer to the model
  model.add(tf.layers.dense({ units: 100, inputShape: [6], activation: "relu" }));
  model.add(tf.layers.dense({ units: 100, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  // Compile the model
  model.compile({ loss: "meanSquaredError", optimizer: "adam" });
  const predictions = [];

  async function generatePredicton() {
    // Train the model
    const xTrain = tf.tensor2d(trainingData);
    const yTrain = tf.tensor2d(targetData);
    await model.fit(xTrain, yTrain, { epochs: 20, shuffle: true }).then(() => {
      console.log("Model trained.");
      let xTest;
      let prediction;
      let predictedBusinessLevel;
      xTest = tf.tensor2d([data[0]]);
      prediction = model.predict(xTest);
      predictedBusinessLevel = prediction.dataSync()[0].toFixed();

      if (parseFloat(predictedBusinessLevel) < 1) {
        console.log("predictedBusinessLevel is invalid", predictedBusinessLevel);
        return "invalid";
      } else if (parseFloat(predictedBusinessLevel) > 10000) {
        predictions.push("10000");
        console.log("predictedBusinessLevel " + predictedBusinessLevel + " is adjusted as too high", "10000");
        return "10000";
      } else {
        predictions.push(predictedBusinessLevel);
        console.log("predictedBusinessLevel is valid", predictedBusinessLevel);
        return predictedBusinessLevel;
      }
    });
  }

  Promise.all([await generatePredicton(), await generatePredicton(), await generatePredicton(), await generatePredicton(), await generatePredicton(), await generatePredicton(), await generatePredicton()]).then(() => {
    const sum = predictions.reduce((acc, prediction) => acc + parseInt(prediction), 0);
    const average = (sum / predictions.length).toFixed(2);
    res.json({ average, predictions });
  });
});

module.exports = router;
