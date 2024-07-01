# Changelog

## [1.1.1](https://github.com/WMS-Corporation/wms-logisticControl-service/compare/v1.1.0...v1.1.1) (2024-07-01)


### Bug Fixes

* Modified methat that update a product in a shelf ([5dbe5a8](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/5dbe5a802048f44756fb457be32bbe8b976f8141))

## [1.1.0](https://github.com/WMS-Corporation/wms-logisticControl-service/compare/v1.0.0...v1.1.0) (2024-06-30)


### Features

* Implemented a new route that allowa to delete a product in a shelf ([70a4f44](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/70a4f44923786387290e6262f746fa62472c5f9b))
* Implemented route that allow to add a new product in a shelf ([5ce48be](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/5ce48beb90f8fe725eb138697409822e5a4690da))
* Implemented route that return all shelf generated ([72967d7](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/72967d7cf069bc42e523c27f622d101d451aba15))
* Implemented route to add product in a shelf ([8d65055](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/8d65055d9fd5d69e56c33b313cd392ab64410aa6))
* **logistic:** completed temperature socketio notification ([9e4b4e2](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/9e4b4e230bf0b990b7b534e1a7426be492ce7127))
* **logistic:** completed temperature socketio notification, added env range configuration ([c995d83](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/c995d83c2c589633e868b470d728ea967d21ea02))
* **logistic:** product event on socket-io, first demo version ([005002f](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/005002f08e31d1506e905da397f67b752333f42e))
* **logistic:** socketio temperature alert example implementation ([df84ae1](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/df84ae1fb3573cb84d03838e1e466ba28245716e))
* Validate product existence when creating and modifying shelves ([3adbe73](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/3adbe73d60dbd3195b140c29b2a385e03589303e))


### Bug Fixes

* **logistic:** product alert simplified ([05b4ca4](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/05b4ca4f5312fb4d5db01f5bd57f849715e523e8))
* **UI:** variable name shelf corrected ([39494f2](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/39494f20a471f12fc8a714ac5eacd2530370a2c8))
* Updated method that modified shelf data ([ba03240](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/ba03240b4ef34e5d95bbfeb2f16f8b467707faaa))

## 1.0.0 (2024-05-03)


### Features

* Implemented a zone entity ([cc19b84](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/cc19b8408275802541d7c6c083822cdd6cdb692c))
* Implemented corridor entity ([e06e05d](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/e06e05d09e0122476be10a86245fd44b5e2eb8ae))
* Implemented middleware to protect all routes ([e3a02a5](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/e3a02a58ee346ac4486a6b9f5d461117efe27e8d))
* Implemented route that create a new corridor ([62581fa](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/62581fafb835bb30b95fffba5682484f6115f70b))
* Implemented route that deleted a corridor ([c9aaba4](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/c9aaba48cc94d313a8c97e6f49e12b4329a7a811))
* Implemented route that deleted a shelf ([c4321e9](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/c4321e9b4b7556739a09677d3c81b15e432a7996))
* Implemented route that deleted a storage ([c60778a](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/c60778af6f03ef3b04a6c1966f03c6fdddc8107f))
* Implemented route that deleted zone ([fbd8ee5](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/fbd8ee5b2ebc0429c623d3c0c7f2ee30fb69c89b))
* Implemented route that generated a new shelf ([b2b3027](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/b2b3027dfa154981aae6753993dd13014b9f6764))
* Implemented route that generated a new zone of storage ([a0df660](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/a0df66017e01d46115c4a1642bd994dca9bd354f))
* Implemented route that generated a storage ([610bfb1](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/610bfb1c9232e45fe35365dff8ecc602b88fe96a))
* Implemented route that return a corridor's data by it's code ([7019794](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/7019794c78ce9f347cbc4677595c624cbcdcf43b))
* Implemented route that return a shelf by it's code ([70fa2da](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/70fa2da32c76d6cce864c62577f52a8390128ed7))
* Implemented route that return a storage by provided it's code ([708f526](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/708f526ac41ddbe23725506b13e7d74c168b550a))
* Implemented route that return a zone by it's code ([d657d60](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/d657d604ea249760e234a62398f498ebe1e4d0f0))
* Implemented route that return all corridors about specifc zone. ([fa3e6ae](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/fa3e6aedbce22083c0cbfa013c69f05e7586da83))
* Implemented route that return all storages ([07c9d85](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/07c9d85a62f86c8707a29840d287924573c865d0))
* Implemented route that return all zones about specific storege ([11a9fc3](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/11a9fc3b0cd8d7da2c7df6490c21bba37a76b63c))
* Implemented route that updated a shelf data ([69351bc](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/69351bcbae6e6398160da17021f9063f9b6f3579))
* Implemented route that updated corridor's data ([b3f6ba5](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/b3f6ba5eddd9f697cc6ef845c806f4ba142c8175))
* Implemented route that updated storage data ([3d78982](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/3d789823748bcfd464fe482aea143d0323b27b37))
* Implemented route that updated zone by it's code ([5df7520](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/5df7520f3abd0f8ca2c3ab3f699980f3caebc2ff))
* Implemented shelf entity ([a48cc85](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/a48cc85dd86387dc4888b6b7ecbe4c5f2bf56ed3))
* Implemented storage entity ([0f50076](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/0f500760d92404633f3749115cbcfc3559b8affb))
* Implemented that return all shelf of specific corridor ([5a0306c](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/5a0306c8e0ed9ea16bcc43e9f98ce21134baf2cb))
* Implemented the connection to DB ([17641fe](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/17641fe9a5f1c6f1ad249c0bc87a7a8a35a0369e))


### Bug Fixes

* Added method that updated the stock of product when the task is completed ([11ceb47](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/11ceb47e92c3d7e46975af515345ce1d7fd6ea83))
* Modified methods that updating dta of Storage, Corridor, Zone and Shelf ([134a6c0](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/134a6c088778332f7a7a106febd8c37b486cff4d))
* Updated product structure in Shelf and implemented control about the upated of product list ([5a75812](https://github.com/WMS-Corporation/wms-logisticControl-service/commit/5a758124da0061971deebbcd5f5d7d8e3b7d47dd))
