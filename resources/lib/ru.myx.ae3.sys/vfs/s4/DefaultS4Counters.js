// TODO: !!! NOT IN STATS, UNFINISHED

const S4Stats = require('java.class/ru.myx.ae3.vfs.s4.S4StatusProvider');

const DefaultS4Counters = {
	group : 'd',
	name : 'd4',
	nameExport : "vfs.s4",
	title : 'S4 Counters',
	columns : {
		s : {
			name : "s",
			nameExport : "writeOps",
			title : "S4 Write Operations, Σ",
			titleShort : "S4 Σ(wr)",
			type : "number",
			variant : "integer",
			log : "detail",
			chart : "counter",
		},
		ds : {
			name : "ds",
			title : "S4 Write Operations, Δ",
			titleShort : "S4 Δ(wr)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 's'
			}
		},
		r : {
			name : "r",
			nameExport : "readOps",
			title : "S4 Read Operations, Σ",
			titleShort : "S4 Σ(rd)",
			type : "number",
			variant : "integer",
			log : "detail",
			chart : "counter",
		},
		dr : {
			name : "dr",
			title : "S4 Read Operations, Δ",
			titleShort : "S4 Δ(rd)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'r'
			}
		},
		s0 : {
			name : "s0",
			title : "S4 WriteSetBinary, Σ",
			titleShort : "S4 Σ(WrSb)",
			type : "number",
			variant : "integer",
		},
		s1 : {
			name : "s1",
			title : "S4 WriteSetText, Σ",
			titleShort : "S4 Σ(WrSt)",
			type : "number",
			variant : "integer",
		},
		s2 : {
			name : "s2",
			title : "S4 WriteSetContainer, Σ",
			titleShort : "S4 Σ(WrSc)",
			type : "number",
			variant : "integer",
		},
		s3 : {
			name : "s3",
			title : "S4 WriteSetModified, Σ",
			titleShort : "S4 Σ(WrSm)",
			type : "number",
			variant : "integer",
		},
		s4 : {
			name : "s4",
			title : "S4 WriteSetPrimitive, Σ",
			titleShort : "S4 Σ(WrSp)",
			type : "number",
			variant : "integer",
		},
		s6 : {
			name : "s6",
			title : "S4 WriteSetHardlink, Σ",
			titleShort : "S4 Σ(WrLn)",
			type : "number",
			variant : "integer",
		},
		s5 : {
			name : "s5",
			title : "S4 WriteDoUnlink, Σ",
			titleShort : "S4 Σ(WrUn)",
			type : "number",
			variant : "integer",
		},
		r0 : {
			name : "r0",
			title : "S4 ReadBinaryContent, Σ",
			titleShort : "S4 Σ(RdBc)",
			type : "number",
			variant : "integer",
		},
		r1 : {
			name : "r1",
			title : "S4 ReadContentCollection, Σ",
			titleShort : "S4 Σ(RdCc)",
			type : "number",
			variant : "integer",
		},
		r2 : {
			name : "r2",
			title : "S4 ReadContentElement, Σ",
			titleShort : "S4 Σ(RdCe)",
			type : "number",
			variant : "integer",
		},
		r3 : {
			name : "r3",
			title : "S4 ReadContentPrimitive, Σ",
			titleShort : "S4 Σ(RdCp)",
			type : "number",
			variant : "integer",
		},
		r4 : {
			name : "r4",
			title : "S4 ReadContentValue, Σ",
			titleShort : "S4 Σ(RdCv)",
			type : "number",
			variant : "integer",
		},
		r5 : {
			name : "r5",
			title : "S4 ReadTextContent, Σ",
			titleShort : "S4 Σ(RdTc)",
			type : "number",
			variant : "integer",
		},
		r6 : {
			name : "r6",
			title : "S4 ReadIsContainerEmpty, Σ",
			titleShort : "S4 Σ(RdIe)",
			type : "number",
			variant : "integer",
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			s : S4Stats.statsTotalWriteOperations,
			r : S4Stats.statsTotalReadOperations,
			s0 : S4Stats.statsWriteSetBinary,
			s1 : S4Stats.statsWriteSetText,
			s2 : S4Stats.statsWriteSetContainer,
			s3 : S4Stats.statsWriteSetModified,
			s4 : S4Stats.statsWriteSetPrimitive,
			s6 : S4Stats.statsWriteSetHardlink,
			s5 : S4Stats.statsWriteDoUnlink,
			r0 : S4Stats.statsReadBinaryContent,
			r1 : S4Stats.statsReadContentCollection,
			r2 : S4Stats.statsReadContentElement,
			r3 : S4Stats.statsReadContentPrimitive,
			r4 : S4Stats.statsReadContentValue,
			r5 : S4Stats.statsReadTextContent,
			r6 : S4Stats.statsReadIsContainerEmpty,
		};
	},
};


module.exports = DefaultS4Counters;