export function getItemAmountByFactory(factoryLines, deliveries) {
	let itemFactoryAmount = factoryLines.flatMap((factory) => {
		return factory.lines.flatMap((line) => {
			let itemAmount = [];
			if (line.INITEMNAME1) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.INITEMNAME1,
					AMOUNT: -line.INAMOUNT1 * line.LINEAMOUNT,
					TODOAMOUNT: -line.INAMOUNT1 * line.TODOAMOUNT
				});
			}
			if (line.INITEMNAME2) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.INITEMNAME2,
					AMOUNT: -line.INAMOUNT2 * line.LINEAMOUNT,
					TODOAMOUNT: -line.INAMOUNT2 * line.TODOAMOUNT
				});
			}
			if (line.INITEMNAME3) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.INITEMNAME3,
					AMOUNT: -line.INAMOUNT3 * line.LINEAMOUNT,
					TODOAMOUNT: -line.INAMOUNT3 * line.TODOAMOUNT
				});
			}
			if (line.INITEMNAME4) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.INITEMNAME4,
					AMOUNT: -line.INAMOUNT4 * line.LINEAMOUNT,
					TODOAMOUNT: -line.INAMOUNT4 * line.TODOAMOUNT
				});
			}
			if (line.OUTITEMNAME1) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.OUTITEMNAME1,
					AMOUNT: line.OUTAMOUNT1 * line.LINEAMOUNT,
					TODOAMOUNT: line.OUTAMOUNT1 * line.TODOAMOUNT
				});
			}
			if (line.OUTITEMNAME2) {
				itemAmount.push({
					FACTORYNAME: factory.FACTORYNAME,
					ITEMNAME: line.OUTITEMNAME2,
					AMOUNT: line.OUTAMOUNT2 * line.LINEAMOUNT,
					TODOAMOUNT: line.OUTAMOUNT2 * line.TODOAMOUNT
				});
			}
			return itemAmount;
		});
	});
	let itemDeliveryAmmount = deliveries.flatMap((delivery) => {
		let itemAmount = [];
		if (delivery.SOURCEFACTORYNAME) {
			itemAmount.push({
				FACTORYNAME: delivery.SOURCEFACTORYNAME,
				ITEMNAME: delivery.ITEMNAME,
				AMOUNT: -delivery.AMOUNT,
				TODOAMOUNT: 0
			});
		}
		if (delivery.DESTINATIONFACTORYNAME) {
			itemAmount.push({
				FACTORYNAME: delivery.DESTINATIONFACTORYNAME,
				ITEMNAME: delivery.ITEMNAME,
				AMOUNT: delivery.AMOUNT,
				TODOAMOUNT: 0
			});
		}
		return itemAmount;
	});
	let itemAmount = itemFactoryAmount.concat(itemDeliveryAmmount);

	return itemAmount.reduce((acc, item) => {
		let factoryName = item.FACTORYNAME;
		let itemName = item.ITEMNAME;

		if (!acc[factoryName]) {
			acc[factoryName] = [];
		}

		const found = acc[factoryName].find((i) => i.ITEMNAME === itemName);
		if (found) {
			found.AMOUNT += item.AMOUNT;
			found.TODOAMOUNT += item.TODOAMOUNT;
		} else {
			acc[factoryName].push({
				ITEMNAME: itemName,
				AMOUNT: item.AMOUNT,
				TODOAMOUNT: item.TODOAMOUNT
			});
		}

		return acc;
	}, {});
}