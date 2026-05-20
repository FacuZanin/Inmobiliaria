"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicacionStatus = void 0;
//shared\src\enums\publicacion-status.enum.ts
var PublicacionStatus;
(function (PublicacionStatus) {
    PublicacionStatus["BORRADOR"] = "BORRADOR";
    PublicacionStatus["EN_REVISION"] = "EN_REVISION";
    PublicacionStatus["OBSERVADA"] = "OBSERVADA";
    PublicacionStatus["RECHAZADA"] = "RECHAZADA";
    PublicacionStatus["PUBLICADA_NO_VERIFICADA"] = "PUBLICADA_NO_VERIFICADA";
    PublicacionStatus["PUBLICADA_VERIFICADA"] = "PUBLICADA_VERIFICADA";
    PublicacionStatus["PAUSADA"] = "PAUSADA";
    PublicacionStatus["ELIMINADA"] = "ELIMINADA";
})(PublicacionStatus || (exports.PublicacionStatus = PublicacionStatus = {}));
