export function getItemAmount(factoryLines, deliveries) {
	let itemFactoryAmount = factoryLines.map((factory) => {
		let itemAmount = {};
		for (const line of factory.lines) {
			if (line.INITEMNAME1) {
				if (itemAmount[line.INITEMNAME1] === undefined) {
					itemAmount[line.INITEMNAME1] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.INITEMNAME1].amount -= line.INAMOUNT1 * line.LINEAMOUNT;
				itemAmount[line.INITEMNAME1].todoAmount -= line.INAMOUNT1 * line.TODOAMOUNT;
			}
			if (line.INITEMNAME2) {
				if (itemAmount[line.INITEMNAME2] === undefined) {
					itemAmount[line.INITEMNAME2] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.INITEMNAME2].amount -= line.INAMOUNT2 * line.LINEAMOUNT;
				itemAmount[line.INITEMNAME2].todoAmount -= line.INAMOUNT2 * line.TODOAMOUNT;
			}
			if (line.INITEMNAME3) {
				if (itemAmount[line.INITEMNAME3] === undefined) {
					itemAmount[line.INITEMNAME3] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.INITEMNAME3].amount -= line.INAMOUNT3 * line.LINEAMOUNT;
				itemAmount[line.INITEMNAME3].todoAmount -= line.INAMOUNT3 * line.TODOAMOUNT;
			}
			if (line.INITEMNAME4) {
				if (itemAmount[line.INITEMNAME4] === undefined) {
					itemAmount[line.INITEMNAME4] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.INITEMNAME4].amount -= line.INAMOUNT4 * line.LINEAMOUNT;
				itemAmount[line.INITEMNAME4].todoAmount -= line.INAMOUNT4 * line.TODOAMOUNT;
			}
			if (line.OUTITEMNAME1) {
				if (itemAmount[line.OUTITEMNAME1] === undefined) {
					itemAmount[line.OUTITEMNAME1] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.OUTITEMNAME1].amount += line.OUTAMOUNT1 * line.LINEAMOUNT;
				itemAmount[line.OUTITEMNAME1].todoAmount += line.OUTAMOUNT1 * line.TODOAMOUNT;
			}
			if (line.OUTITEMNAME2) {
				if (itemAmount[line.OUTITEMNAME2] === undefined) {
					itemAmount[line.OUTITEMNAME2] = {
						amount: 0,
						todoAmount: 0
					};
				}
				itemAmount[line.OUTITEMNAME2].amount += line.OUTAMOUNT2 * line.LINEAMOUNT;
				itemAmount[line.OUTITEMNAME2].todoAmount += line.OUTAMOUNT2 * line.TODOAMOUNT;
			}
		}

		return {
			FACTORYNAME: factory.FACTORYNAME,
			ITEMAMOUNT: itemAmount
		};
	});
	let itemDeliveryAmmount = deliveries.reduce((acc, delivery) => {
		if (delivery.SOURCEFACTORYNAME) {
			if (acc[delivery.SOURCEFACTORYNAME] === undefined) {
				acc[delivery.SOURCEFACTORYNAME] = {};
			}
			if (acc[delivery.SOURCEFACTORYNAME][delivery.ITEMNAME] === undefined) {
				acc[delivery.SOURCEFACTORYNAME][delivery.ITEMNAME] = 0;
			}
			acc[delivery.SOURCEFACTORYNAME][delivery.ITEMNAME] -= delivery.AMOUNT;
		}
		if (delivery.DESTINATIONFACTORYNAME) {
			if (acc[delivery.DESTINATIONFACTORYNAME] === undefined) {
				acc[delivery.DESTINATIONFACTORYNAME] = {};
			}
			if (acc[delivery.DESTINATIONFACTORYNAME][delivery.ITEMNAME] === undefined) {
				acc[delivery.DESTINATIONFACTORYNAME][delivery.ITEMNAME] = 0;
			}
			acc[delivery.DESTINATIONFACTORYNAME][delivery.ITEMNAME] += delivery.AMOUNT;
		}
		return acc;
	}, {});
	return [itemFactoryAmount, itemDeliveryAmmount];
}