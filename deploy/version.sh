VERSION=$1

echo "Applying version ${VERSION} to manifests"

cd public

jq ".version = \"${VERSION}\"" manifest.webapp > tmp.json && mv tmp.json manifest.webapp

cd -

echo "Done"
