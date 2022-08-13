VERSION=$1

echo "Packaging version ${VERSION}"

cd public && zip -r ../Kaite_v${VERSION}.zip * && cd ..