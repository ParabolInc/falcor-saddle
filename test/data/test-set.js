"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var TEST_SET = {
	len: 51, // Length of cache.neighborhoodsById
	ranges: [// Sets of ranges to test, and their expected outputs
	// [ range, expected ],
	{ "min": "0", "max": "0", "expected": { "json": {
				"neighborhoods": {
					"0": ["neighborhoodsById", "0"],
					"$__path": ["neighborhoods"]
				}
			} }
	}, { "min": "50", "max": "50", "expected": { "json": {
				"neighborhoods": {
					"50": ["neighborhoodsById", "50"],
					"$__path": ["neighborhoods"]
				}
			} }
	}, { "min": "0", "max": "50", "expected": { "json": {
				"neighborhoods": {
					"0": ["neighborhoodsById", "0"],
					"1": ["neighborhoodsById", "1"],
					"2": ["neighborhoodsById", "2"],
					"3": ["neighborhoodsById", "3"],
					"4": ["neighborhoodsById", "4"],
					"5": ["neighborhoodsById", "5"],
					"6": ["neighborhoodsById", "6"],
					"7": ["neighborhoodsById", "7"],
					"8": ["neighborhoodsById", "8"],
					"9": ["neighborhoodsById", "9"],
					"10": ["neighborhoodsById", "10"],
					"11": ["neighborhoodsById", "11"],
					"12": ["neighborhoodsById", "12"],
					"13": ["neighborhoodsById", "13"],
					"14": ["neighborhoodsById", "14"],
					"15": ["neighborhoodsById", "15"],
					"16": ["neighborhoodsById", "16"],
					"17": ["neighborhoodsById", "17"],
					"18": ["neighborhoodsById", "18"],
					"19": ["neighborhoodsById", "19"],
					"20": ["neighborhoodsById", "20"],
					"21": ["neighborhoodsById", "21"],
					"22": ["neighborhoodsById", "22"],
					"23": ["neighborhoodsById", "23"],
					"24": ["neighborhoodsById", "24"],
					"25": ["neighborhoodsById", "25"],
					"26": ["neighborhoodsById", "26"],
					"27": ["neighborhoodsById", "27"],
					"28": ["neighborhoodsById", "28"],
					"29": ["neighborhoodsById", "29"],
					"30": ["neighborhoodsById", "30"],
					"31": ["neighborhoodsById", "31"],
					"32": ["neighborhoodsById", "32"],
					"33": ["neighborhoodsById", "33"],
					"34": ["neighborhoodsById", "34"],
					"35": ["neighborhoodsById", "35"],
					"36": ["neighborhoodsById", "36"],
					"37": ["neighborhoodsById", "37"],
					"38": ["neighborhoodsById", "38"],
					"39": ["neighborhoodsById", "39"],
					"40": ["neighborhoodsById", "40"],
					"41": ["neighborhoodsById", "41"],
					"42": ["neighborhoodsById", "42"],
					"43": ["neighborhoodsById", "43"],
					"44": ["neighborhoodsById", "44"],
					"45": ["neighborhoodsById", "45"],
					"46": ["neighborhoodsById", "46"],
					"47": ["neighborhoodsById", "47"],
					"48": ["neighborhoodsById", "48"],
					"49": ["neighborhoodsById", "49"],
					"50": ["neighborhoodsById", "50"],
					"$__path": ["neighborhoods"]
				}
			} }
	}, { "min": "1", "max": "11", "expected": { "json": {
				"neighborhoods": {
					"1": ["neighborhoodsById", "1"],
					"2": ["neighborhoodsById", "2"],
					"3": ["neighborhoodsById", "3"],
					"4": ["neighborhoodsById", "4"],
					"5": ["neighborhoodsById", "5"],
					"6": ["neighborhoodsById", "6"],
					"7": ["neighborhoodsById", "7"],
					"8": ["neighborhoodsById", "8"],
					"9": ["neighborhoodsById", "9"],
					"10": ["neighborhoodsById", "10"],
					"11": ["neighborhoodsById", "11"],
					"$__path": ["neighborhoods"]
				}
			} }
	}, { "min": "15", "max": "20", "expected": { "json": {
				"neighborhoods": {
					"15": ["neighborhoodsById", "15"],
					"16": ["neighborhoodsById", "16"],
					"17": ["neighborhoodsById", "17"],
					"18": ["neighborhoodsById", "18"],
					"19": ["neighborhoodsById", "19"],
					"20": ["neighborhoodsById", "20"],
					"$__path": ["neighborhoods"]
				}
			} }
	}],
	invalid_ranges: [{ "min": "50", "max": "55", "expected": [{ path: ["neighborhoods", "50"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}, { path: ["neighborhoods", "51"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}, { path: ["neighborhoods", "52"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}, { path: ["neighborhoods", "53"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}, { path: ["neighborhoods", "54"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}, { path: ["neighborhoods", "55"],
			value: {
				message: "TypeError: Cannot set property \'id\' of undefined"
			}
		}]
	}],
	ids: [{ "id": "0", "keys": ["name", "population", "borough"], "expected": {
			"json": {
				"neighborhoodsById": {
					"0": {
						"$__path": ["neighborhoodsById", 0],
						"name": "Brooklyn Heights-Cobble Hill",
						"population": "22548",
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}
	}, { "id": "15", "keys": ["name"], "expected": {
			"json": {
				"neighborhoodsById": {
					"15": {
						"$__path": ["neighborhoodsById", 15],
						"name": "Stuyvesant Heights"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}
	}, { "id": "27", "keys": ["borough"], "expected": {
			"json": {
				"neighborhoodsById": {
					"27": {
						"$__path": ["neighborhoodsById", 27],
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}
	}, { "id": "29", "keys": ["name", "population", "borough"], "expected": {
			"json": {
				"neighborhoodsById": {
					"29": {
						"$__path": ["neighborhoodsById", 29],
						"name": "Crown Heights South",
						"population": "42370",
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}
	}, { "id": "50", "keys": ["borough", "name", "population"], "expected": {
			"json": {
				"neighborhoodsById": {
					"50": {
						"$__path": ["neighborhoodsById", 50],
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}",
						"name": "park-cemetery-etc-Brooklyn",
						"population": "93"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}
	}],
	invalid_ids: [{ "id": "60", "keys": ["borough", "name", "population"], "expected": [{
			"path": ["neighborhoodsById", "60", "borough"],
			"value": {
				"message": "TypeError: Cannot set property \'id\' of undefined"
			}
		}, {
			"path": ["neighborhoodsById", "60", "name"],
			"value": {
				"message": "TypeError: Cannot set property \'id\' of undefined"
			}
		}, {
			"path": ["neighborhoodsById", "60", "population"],
			"value": {
				"message": "TypeError: Cannot set property \'id\' of undefined"
			}
		}]
	}],
	updates: [{ "id": "10", "keys": ["population", "borough", "name"], "obj": {
			"json": {
				"neighborhoodsById": {
					"10": {
						"population": "lorem ipsum",
						"borough": "lorem ipsum",
						"name": "lorem ipsum"
					}
				}
			}
		}, "expected": {
			"json": {
				"neighborhoodsById": {
					"10": {
						"$__path": ["neighborhoodsById", "10"],
						"population": "lorem ipsum",
						"name": "lorem ipsum",
						"borough": "lorem ipsum"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}, "record": {
			"name": "lorem ipsum",
			"population": "lorem ipsum",
			"borough": "lorem ipsum",
			"id": "10"
		}
	}, { "id": "45", "keys": ["population", "name"], "obj": {
			"json": {
				"neighborhoodsById": {
					"45": {
						"population": "lorem ipsum",
						"name": "lorem ipsum"
					}
				}
			}
		}, "expected": {
			"json": {
				"neighborhoodsById": {
					"45": {
						"$__path": ["neighborhoodsById", "45"],
						"name": "lorem ipsum",
						"population": "lorem ipsum"
					},
					"$__path": ["neighborhoodsById"]
				}
			}
		}, "record": {
			"name": "lorem ipsum",
			"population": "lorem ipsum",
			"borough": {
				"$type": "ref",
				"value": ["boroughsById", "1"]
			},
			"id": "45"
		}
	}],
	invalid_updates: [{ "id": "60", "keys": ["population", "name"], "obj": {
			"json": {
				"neighborhoodsById": {
					"60": {
						"population": "lorem ipsum",
						"name": "lorem ipsum"
					}
				}
			}
		}, "expected": [{ path: ['neighborhoodsById', 60, 'population'],
			value: { message: 'TypeError: Cannot set property \'id\' of undefined' } }, { path: ['neighborhoodsById', 60, 'name'],
			value: { message: 'TypeError: Cannot set property \'id\' of undefined' } }]
	}],
	creates: [{ "id": "51", "fields": { name: 'new neighborhood one',
			population: '0',
			borough: {
				"$type": "ref",
				"value": ["boroughsById", "1"]
			}
		}, "keys": ["name", "population", "borough"], "expected": {
			"json": {
				"neighborhoods": {
					"51": {
						"$__path": ["neighborhoodsById", 51],
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}",
						"name": "new neighborhood one",
						"population": "0"
					},
					"$__path": ["neighborhoods"],
					"length": 52
				}
			}
		}, "record": { name: 'new neighborhood one',
			population: '0',
			borough: {
				"$type": "ref",
				"value": ["boroughsById", "1"]
			},
			id: "51"
		}
	}, { "id": "52", "fields": { name: 'new neighborhood 2',
			population: '2',
			borough: {
				"$type": "ref",
				"value": ["boroughsById", "1"]
			}
		}, "keys": ["name", "population", "borough"], "expected": {
			"json": {
				"neighborhoods": {
					"52": {
						"$__path": ["neighborhoodsById", 52],
						"borough": "{\"$type\":\"ref\",\"value\":[\"boroughsById\",\"1\"]}",
						"name": "new neighborhood 2",
						"population": "2"
					},
					"$__path": ["neighborhoods"],
					"length": 53
				}
			}
		}, "record": { name: 'new neighborhood 2',
			population: '2',
			borough: {
				"$type": "ref",
				"value": ["boroughsById", "1"]
			},
			id: "52"
		}
	}],
	deletes: [{ "id": "2", "expected": {
			"json": {
				"neighborhoods": {
					"$__path": ["neighborhoods"],
					"length": 50
				}
			}
		}, "len": 50
	}, { "id": "42", "expected": {
			"json": {
				"neighborhoods": {
					"$__path": ["neighborhoods"],
					"length": 49
				}
			}
		}, "len": 49
	}]
};

exports.TEST_SET = TEST_SET;