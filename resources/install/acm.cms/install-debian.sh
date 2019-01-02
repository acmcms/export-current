#!/bin/sh -ex

#BRANCH=stable
#BRANCH=release
BRANCH=current

case "$1"
	install)
		DEBDIR="`pwd`"
		BUILDDIR="`mktemp -dt acmdeb.mkdeb.XXXXXX`"
		trap '[ -z "$BUILDDIR" ] || rm -rf "$BUILDDIR"' EXIT
		
		cd "$BUILDDIR"
		cvs -d :pserver:guest:guest@cvs.myx.ru:/var/share -f -z 6 \
		  export -rHEAD export/sys-"$BRANCH"/
		  
		mkdir -p export/usr/share/acmdeb
		mv export/sys-"$BRANCH" export/usr/share/acmdeb

		cvs -d :pserver:guest:guest@cvs.myx.ru:/var/ae3 -f -z 6 \
		  export -rHEAD acm-install-debian/
		
		# TODO: remove when debian directory is in CVS, too.
		ln -s "$DEBDIR"/acm-install-debian/debian export
		
		cd export
		dpkg-buildpackage -rfakeroot -b -uc -tc
		
		cp -a ../*.{changes,deb} "$DEBDIR"
		
		exit 0
	;;
esac

echo "Say: $0 install (sorry, it is not a 'usage' yet.... just because I'm now running on reserve battery power!)"
