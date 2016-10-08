/**
 *
 * Changes a qif stream into a relational DB table.
 *
 */



//read each transaction, and call the transaction with the parameters

 Transaction = function(type, thisTrx) {
     if (thisTrx != null)
     {
         if (type.startsWith('QIF'))
    	 {
    		var datePat = /D\d{2}\/\d{2}\'\d{4}/g;
            var dateList = thisTrx.match(datePat);
            if (dateList) {
             	this.date = this.parseDate(dateList[0]);
            }
            this.memo = this.parseQifMemo(thisTrx);
            this.amount = this.parseQifAmount(thisTrx);
        }
        if (type == 'QIF_BANK')
        {
            this.refnum = this.parseQifRefnum(thisTrx);
    	 	if (this.amount <0)
    	 		this.mode = 'DR';
    	 	else {
    	 		this.mode = 'CR';
    	 	}
    	 	this.payee = this.parseQifPayee(thisTrx);

    	 	this.category = this.parseQifCatg(thisTrx);
    	 	this.tax =  "";
    	 }
    	 else if (type == 'QIF_INVST')
         {
            this.action = this.parseInvAction(thisTrx);
            this.security = this.parseInvSecurity(thisTrx);
            this.price = this.parsePrice(thisTrx);
            this.quantity = this.parseQty(thisTrx);
            this.commission = this.parseCommission(thisTrx);
            this.sectrantax = 0;
            this.taxcatg = this.parseTaxCatg(this.security);
            this.transferaccount = this.parseBankAccount(thisTrx);
            this.trframount = this.parseTrfrAmount(thisTrx);
            this.sectype = this.parseSecType(this.security);
            this.seccode = this.getSecCode(this.security);
            this.advisor = "";
            this.folio = "";
         }
         else
         {
            var cols = thisTrx.match(/("([^"]*)"|[^,]*),/g);
            var tDate = cols[1].replace(/,$/, '');
            this.date = this.parseDate(tDate);
     	 	this.refnum = cols[3].replace(/,$/, '');
     	 	this.amount = parseFloat(new String(cols[4]).replace(/[^0-9-.]/g, ''));
     	 	this.mode = cols[5].replace(/,$/, '');
     		this.memo = cols[2].replace(/,$/, '');
     	 	this.category = {};
            this.category.main = "";
     	 	this.category.sub= "";
     	 	this.tax="";

         }
         console.log(JSON.stringify(this));
     }
     else {
         console.log("Input Transaction is null");
     }
 };

Transaction.prototype.parseDate = function(thisTrx) {
		//Get Date (read first 10 characters), and format
        var tDate = new Date();
        tDate.setHours(10,0,0);

        //var datePattern = /D(\d{2})\/(\d{2})\'(\d{4})/;
        console.log("Input Text - " + thisTrx);
        var datePattern = /(\d{1,4})/g;

        console.log(datePattern);
        dateList = thisTrx.match(datePattern);
        if (dateList != null && dateList.length ==3)
        {
            var year = parseInt(dateList[2]);
            console.log("year is --> " + year);
            year = (year < 18)? year+2000:year;
            year = (year >= 18 && year < 100)? year + 1900 : year;
            console.log("year is --> " + year);

            tDate.setFullYear(year);
            tDate.setMonth(parseInt(dateList[1])-1);
			tDate.setDate(parseInt(dateList[0]));

        }
    	else
        {
			console.log("Not able to get the date for transaction --> " + thisTrx);
		}
		return tDate.toJSON();

	}

	//console.log('JSON of the Date is ' + tDate.toJSON());

	//Memo
Transaction.prototype.parseQifMemo = function(inpText) {
	var memoPattern = new RegExp(/\r\nM(.*)\r\n/)
	var textMemo = memoPattern.exec(inpText);
	var tMemo = '';

	if (textMemo != null) {
		//console.log('Memo is - ' + textMemo);
		tMemo = textMemo[1];
	}
	return tMemo;
};

Transaction.prototype.parseQifPayee = function(inpText){
	var payeePattern = new RegExp(/\r\nP(.*)\r\n/);
	var textPayee = payeePattern.exec(inpText);
	var tPayee = '';

	if (textPayee != null) {
		//console.log('Payee is - ' + textPayee);
		tPayee = textPayee[1];
	}
	return tPayee;
};

Transaction.prototype.parseQifRefnum = function(inpText) {
	var refnumPattern = new RegExp(/\r\nN(.*)\r\n/);
	var textrefnum = refnumPattern.exec(inpText);
	var tRefnum = '';

	if (textrefnum != null) {
		//console.log('refnum is - ' + textrefnum);
		tRefnum = textrefnum[1];
	}
	return tRefnum;
};


Transaction.prototype.parseQifCatg = function(inpText) {
	var catgPattern = new RegExp(/\r\nL(.*)\r\n/);
	var textCatg = catgPattern.exec(inpText);
	var tCatg = {};

	if (textCatg != null) {
		//console.log('refnum is - ' + textrefnum);
		var sepIndex = textCatg[1].indexOf(':');
		if (sepIndex >0) {
			tCatg.main = textCatg[1].substring(0, sepIndex);
			tCatg.sub  = textCatg[1].substring(sepIndex+1);
		}
		else
			tCatg.main = textCatg[1];
	}
	return tCatg;

};

Transaction.prototype.parseQifAmount = function(inpText) {
	var amtPattern = new RegExp(/T([-]?(\d*,*)*.\d{1,2})/);
	var textAmount = amtPattern.exec(inpText);
	var tAmount = 0;

	if (textAmount != null)
	{
		tAmount = parseFloat(textAmount[1].replace(/[^0-9-.]/g, ''));
	}
	return tAmount;
};


Transaction.prototype.parseInvAction= function(thisTrx) {
    var actionPattern = new RegExp(/\r\nN(.*)$/);
    var action = actionPattern.exec(thisTrx);

    if (action.startsWith('Buy'))
        return 'Buy';
    else if (action.startsWith('Sell')) {
        return 'Sell';
    }

    return 'Unknown';

}
Transaction.prototype.parseInvSecurity = function(thisTrx) {
    var secName = (/\r\nY(.*)$/).exec(thisTrx);

    if (secName)
        return secName;

    return 'Unknown';
}
Transaction.prototype.parsePrice = function(thisTrx) {
    var pricePattern = new RegExp(/I([-]?(\d*,*)*.\d{1,2})/);
	var textPrice = pricePattern.exec(thisTrx);
	var tAmount = 0;

	if (textPrice != null)
	{
		tAmount = parseFloat(textPrice[1].replace(/[^0-9-.]/g, ''));
	}
	return tAmount;

}
Transaction.prototype.parseQty = function(thisTrx) {
    var qtyPattern = new RegExp(/Q([-]?(\d*,*)*.\d{1,2})/);
	var textQty = qtyPattern.exec(thisTrx);
	var tAmount = 0;

	if (textQty != null)
	{
		tAmount = parseFloat(textQty[1].replace(/[^0-9-.]/g, ''));
	}
	return tAmount;
}
Transaction.prototype.parseCommission = function(thisTrx) {
    var commPattern = new RegExp(/O([-]?(\d*,*)*.\d{1,2})/);
	var textCommission = commPattern.exec(thisTrx);
	var tAmount = 0;

	if (textCommission != null)
	{
		tAmount = parseFloat(textCommission[1].replace(/[^0-9-.]/g, ''));
	}
	return tAmount;

}
Transaction.prototype.parseTaxCatg = function(security) {
    return 'Unknown';

}
Transaction.prototype.parseBankAccount = function(thisTrx) {
    var bankAccPattern = new RegExp(/\r\nL[L\[(.+[^\[\]])\]]/);

    var textTransferAccount = bankAccPattern.exec(thisTrx);

    if (textTransferAccount)
        return textTransferAccount;

    return 'Unknown';
}
Transaction.prototype.parseTrfrAmount = function(thisTrx) {
    var trfrAmtPattern = new RegExp(/\$([-]?(\d*,*)*.\d{1,2})/);
    var textTrfrAmount = trfrAmtPattern.exec(thisTrx);
    var tAmount = 0;

    if (textTrfrAmount != null)
    {
        tAmount = parseFloat(textTrfrAmount[1].replace(/[^0-9-.]/g, ''));
    }
    return tAmount;

}
Transaction.prototype.parseSecType = function(security) {
    return "Unknown";
}
Transaction.prototype.getSecCode = function(security) {
    return "Unknown";
}


module.exports.trxToJson = function(primaryAccount, inpText) {
	if (inpText.startsWith("!Type"))
    {
        return (qifToJson(primaryAccount, inpText));
    }
	else
	{
		return (csvToJson(primaryAccount, inpText));
	}
}


qifToJson = function(primaryAccount, inpText) {
	var allTrans = [];
	var splitChar = "^";
    var trnType = "QIF_BANK";
	//console.log("Input Text is " + inpText);
	var transactions = inpText.split(splitChar);
	transactions.forEach(function save(thisTrx)
	{
		if (thisTrx.startsWith("!Type"))
        {
            if (thisTrx.startsWith("!Type:Invst"))
                trnType = "QIF_INVST";
            thisTrx = thisTrx.substr(thisTrx.indexOf("\n")+1);

        }
		if (thisTrx.length >2)
		{
			console.log('Length of String is - ' + thisTrx.length);
			trn = new Transaction(trnType, thisTrx);
			if (trn) {
				trn.account = primaryAccount;
				allTrans.push(trn);
			}
		}
	});
	return allTrans;
}

csvToJson = function(primaryAccount, inpText) {
	var allTrans=[];
	var splitChar = "\n";


	var transactions = inpText.split(splitChar);

	transactions.forEach(function save(thisTrx, index) {
		if (index > 0)
		{
			trn = new Transaction('CSV', thisTrx);
			if (trn) {
				trn.account = primaryAccount;
				allTrans.push(trn);
			}

		}

	})

	return allTrans;
}
