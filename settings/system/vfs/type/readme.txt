VFS types should be registered there.

put json file with <vfs-fs-type>.json name, the contents are like this:
{
	type : "ae3/Factory",
	name : "zipfs",
	description : "ZIP FS, args: <vfsZipFilePath>",
	reference : "ru.myx.ae3.sys/vfs/FactoryZIPFS"
}