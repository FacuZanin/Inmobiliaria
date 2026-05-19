"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicacionStatus = void 0;
//shared\src\enums\publicacion-status.enum.ts
var PublicacionStatus;
(function (PublicacionStatus) {
    PublicacionStatus["BORRADOR"] = "BORRADOR";
    PublicacionStatus["EN_REVISION_DOCUMENTAL"] = "EN_REVISION_DOCUMENTAL";
    PublicacionStatus["EN_REVISION_ADMIN"] = "EN_REVISION_ADMIN";
    PublicacionStatus["PUBLICADA"] = "PUBLICADA";
    PublicacionStatus["OBSERVADA"] = "OBSERVADA";
    PublicacionStatus["RECHAZADA"] = "RECHAZADA";
    PublicacionStatus["PAUSADA"] = "PAUSADA";
})(PublicacionStatus || (exports.PublicacionStatus = PublicacionStatus = {}));
