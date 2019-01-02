import ru.myx.ae3.binary.Transfer;
import ru.myx.ae3.binary.TransferCopier;

const BinaryObject = Object.create(TransferCopier);

/*
BinaryObject.slice = function(start, count){
	this.nextCopy().toSubBuffer;
};
*/

// object.SORTER_KEY_ASC = sorterKeyAsc;
// object.SORTER_KEY_DESC = sorterKeyDesc;

module.exports = Transfer;