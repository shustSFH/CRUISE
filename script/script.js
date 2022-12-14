let map = L.map('map', {
    center: [41.42698, 32.92053],
    zoom: 6,
    coordinateControl: true,
    zoomControl: false
});
//L.tileLayer('maps/atlas/{z}/{x}/{y}.png', {
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    maxZoom: 9,
})
    .addTo(map);

let marker;
let markerArr = [];
let hotlineLayer;
let pointList = [];
let allRoute;
let ofcruiseInfo = [];
let ofpersonData = [];
let ofcardData = [];
let ofopenCardData = [];
let ofspeedData = [];
let ofcoords = [];
const dlAnchorElem = document.getElementById('downloadAnchorElem');


function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

let LeafCircleIcon = L.Icon.extend({
    options: {
        iconSize: [19, 19],
        iconAnchor: [19 / 2, 19 / 2]
    }
});

let LeafIcon = L.Icon.extend({
    options: {
        iconSize: [25, 30],
        iconAnchor: [25 / 2, 30 / 2]
    }
});

let CircleShip = new LeafCircleIcon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADLUlEQVRIic3XTW8TRxgH8P/MjtfJJgHbC45qRyIciGiUoFjikgDGF6CySyRaFAkhEHwBKs7NDT5AEWekckBIe0M4EeRkXgoXpESpASk9ECRilJdNHEG83teHQ+sl5A0TvND/bUYz89NotDvPAN8prN6B/dqJmMTwMxilmYcfiLEOAGBEb4jjLQMvkCmNPD47stQQeEA71scZv8Ijy1k5Mc9Fuw7eYoCHLQCAV5VBlWbYsyrsUtzzyjvyjKThh0Ojf28LPnRnsI1b1nWhLp4L9/7Dxa66NgJ3cSeqxX2ePaf+Kcj8rTBUeF83nNaO7/VCXl5JveiW95TqAtfGmk6iMv5jUZjiZOHMvenPwmnt+F40m89aBiZiUmx5W2gtjh5B5WlK5+/DB9fifHXj0J3BNi/k5ZUGoAAg1DKU/nHVCTt3M1qmdVOYW9Z1JfWiWzQA/QRPvexxWPjahvCAdqyPx/Vz2z3TrSJ3zkDavXQhrWV718Gc8ytKzxTfeOrXp7lnihNzr34C92snYnzncrYR57pZhFoGj7zLHb6Vi/ow53RSTs4HtttaQolZiYXdnA8z4IiI60G7EO06iCjtwyCW5C1G4DBXqmBESR9mDInavzdQuMkE4yzhwwAocPUjRD5MhBJV5cBRzwiDCKWPMDDjVZq/AdwEYBXMCA/tWTVw2JndBRAKPgxb5J237W7QsF2KuyJkjvrw47MjS87ijlFHjwSGOnoETrktXzhVKPswADCOYbPY5QUFG8UujyQarrV9+NHpe5P2fPSmNZ1sOGq96oA7H73x5Jex4joYAASZlyrj3c/dhWjDUFePwJjYP6kYdHl1/7rSJ3P7p06v1Xym9I+rQi1/FeroEaw87VtwLeXgk19HX28J13An7NxVUi975M6ZbaHWqw4YE/snXZIH16KbwgCQ0TKtDpf/kKLLF5UDU1z6gvK2Uuzy3LnYDcWgy2Pnx1Y2GvfZgj6tZXuJuVd55F0ulJiTRPsCJMUAa/r3UqGqDHdFgTOnwi7FXafclgfD73+dvv98q3XrfsIcvpWLkmxnGdhRAAkQOv5b4Q2AEoEehIQ1UvtO/7f5AMnaRGz3HdljAAAAAElFTkSuQmCC'
})
let Ship = new LeafIcon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAHECAYAAAB1BsUrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACQtSURBVHhe7Z17jB1XfcfP3r37vLvj3ezau46ddpMYSEjADo+WFihBDQRoS0tFSyOgLWr/aIsQVCqFvnQV8UeKEH+0VYWQoIDog7aoRZCQ0BSakD4CCYI8KIHmnRBM4sTO2om99u7ent+dM3j37vzOmZk7c+acM9+PNDtznYftmfud3+P8fucngLt86EMf6l1zzTU99RE4QEudgYPcd9994mvfvU2IbvQ6ebxH/TKokRF1Bq7QjT4gf75eHvMjmyMX9FrbDMxecfXqYXUNagAWxj1+RR4vlsegWIgPqzOoCQjGPR5T5zTeqM6gJiAY9ziuzmno/hmwAATjHqfVOY0NdQY1AcG4x4w6pzGrzqAmIBj3WFLnNHaJbqQTFKgYCMY9zldnjovUGdQABOMS3WhR/pyLP7BAMDUCwbhFFjFcos6gBiAYt7hUnXXAwtQIBOMWF6qzjgPqDGoAgnGLLNbjIhnrtNU1sAwE4xZZrAeJBVamJiAYV4itRlYhII6pCQjGHUgsWV0tCKYmIBh3yCOC56kzsAwE4w554pIs6WdQARCMO2RJKScg6K8JCMYd8liNOdGNltU1sAgE4w55A/lD6gwsAsG4QDeigksqvMwD3LIagGDcoEiaGJmyGoBg3KCItcBaTA1AMG5QpGQfqeUagGDcoIiFWVaxD7AIBOMGrHs1NrmprlJB4G8ZCMYN2C/+7JJWMHDLLAPB1E03WpE/J+MP22m1eyLSCwaZMstAMPXDumMzi5uis6Dduw+ZMstAMPXDfuk752z2RaMBgrEMBFM/bNHltBTM7B5D0I92ZatAMPXDB/y7N8XkbE+0J9khZCQWWBmLQDD1w2a6Zhbj+CU5M0AwFoFg6iTeJ3l//GEnFMMQhjgGazEWgWDqhf2yT8xsirGp+JpcMw0H1RlYAIKpF9adooA/IbE0DLAwFoFg6oUP+Ldkx5BadgcIpl7YKuXO/BbBSJdsZOeA2IQZGQuxcRAoFwimXlgLM2hVDFYGNWWWgGDqhXWnBuMWuGVuAMHURbzrS+r4PXK/tgb9xODnAfJs0QSGAIKpD22GrDWqPiiiJe3iJVwyS0Aw9cEKJs39MqSW4ZJZAoKpD7aXJU0chhgG7cqWgGDqg8+QLewUR3tCiKk5WJm6gWDqI5dLRiC1XD8QTB0YhifxgtEG/mhXtgAEUw+sdaHel/FO+qp+mqu2BbhkFoBg6kFjXXgr0tG7ZOz/E5QHBFMPrDXQpY8jfbsyTVdO3X0GlAcEUw/syryu94VcNU27MgErUzEQTD2wGS1DCYwp8EccUzEQTD3kzpAlGHaRgWAqBoKxTTeiwUns8CRDCYwpU1ZkCgDIAQRjH9a60Er+6Jj6wGCwQLAwFQPB2EezrZLeuhAGC4Sgv2IgGPuwGTJDQN+H2pVpk3IGalemzc1BRUAw9mHdpuktffw6UFNWHxCMfQpnyBLgltUHBGMf1sJkFQy5ZRpQhFkhEIxNuhG9/VN32x8d74mpXdpV/B9hiHXgklUIBGMX1rqY1l+2gtRyfUAwdhk6fiEM/+6iWhwFFQDB2IWNL0w1ZFuhxU1DuzIC/4qAYOzCukuzu81rMFuZ3aP99w+pMygZCMYupcQwhOHfx8Z+FQHB2CIenkS7XaaSJ4Yh0K5cDxCMPdgvMQ1Pom2U8oAy/3qAYOzBBuKGL38qBotE05XRrlwBEIw92F6VPBmyBGpXHpuGlbENBGMPfg1GH4+wYAHTPhCMPdgvcN4MWQLiGPtAMPbQrPLnW4NJQLuyfSAYG8QzKNnhSZ2FbEWXg6DM3z4QjB1Y9yjv+stWDKv9cMkqAIKxA/vlLZIhS5ie7+nalSdVOwEoEQjGDpo+/uKCIZApswsEYwfeJSuYUk6AYOwCwdiBF8yQFqajFxyKMEsGgqmauESF3fqo6BpMAsr87QLBVA8beFNpCzc8KStILdsFgqke1h0b1roQBpcO7colA8FUD/uWL1KlPAi1KxtS09hFpkQgmOphS1Q6GXe6NIGZMfaAYKqHtTDDZsgSDP8fbOxXIhBM9bBv+GFW+beCdmV7QDBVEgfcc/GHnZRlYVDmbw8Iplr4DJmMO1qj6sOQGGKYFSnc1EppkB8IplrYDFUZKeWEsal4TUcD1mNKAoKpFrY0pUzBEMYZ/qAUIJhq4TNkQxZdDtLRx0PoviwJCKZaNDFMuYJBpswOEExVdCOaA1P5GkwCFi/tAMFUB4mFHZ40OTtc0eUgBgEi6C8JCKY6rFkXgtqVSYgM1K4MK1MCEEx18PFLyRmyBMP/F4IpAQimOtiUct5ZMFmBW1Y9EEx18IuWFbhkRLSkFSJSyyUAwVSHdZfMUMwJl6wEIJgq6EZUcMl2OlYlGINLBsGUAARTDWy8MBnlH56UFYNg5qSQ2QloIBsQTDWwb/My2pI5qPqZqqA1wMoMCQRTDXxbckXuWILByqC/f0ggmGpgXbLpkvr4OQyCxMZ+QwLBVINmlb+aNZiE2d1awcAlGxIIphrYL2YVZTFbgUtWLRBM2XQj2hY2dYIxjaagmq8qMViw/fLPh3blIYBgyoe1LlUH/AS1K9Pcfw1wy4YAgimf2tyxBMPvA8EMAQRTPmwmqqx9yEwY1npQUzYEEEz5sBkyQwarNDoLWLysCgimfNhMVNUp5QRDrIQy/yGAYMokzkDRiPFUbAT9RLSs/X0ukn/O1NZpYAaCKRf27U0b7VEGywa0X4CmXVm7OQfQA8GUi2aF3451SUCmrBogmHJhv4hVVimngW2XqgGCKZfKhydlxZCRw8yYgkAw5cK6ZLYC/gTUlFUDBFMurKtjO4YxLJIi6C8IBFMWcftvamHjSKtnbZU/gQRKvy8D2pULAsGUB2tdSCxlDU/KCv1+BpEeUmeQAwimPJxxxxIMvy/csgJAMOXBZp5sB/wJBsEgU1YACKY8+AyZ5ZRyAtqVyweCKQ9WMLYXLRMMi5dILRcAgimDuJjRtxhmWf652ZHoIB0IphxYsbQne2K8U20fPwftsGloV0bgnxMIphz4+KWmgD/BUOoPtywnEEw5sIKx1TTGYRAsMmU5gWDKgf3i2WpL5kC7crlAMOXAuja2S2IGMQT+EExOIJhy0Lhk9QrGkNI+gHblfEAww9KNaHCS9eFJWaF2ZcrUMWjT4WAnEMzwsNZlam5TjI6pDzViEC0EkwMIZnjYL1zd7ljC7B5t4I+1mBxAMMPDZsjqTiknGDJ1B9UZZACCGR7WwlQ9PCkrBpcMFiYHEMzwsF+4ugP+BKSWywOCGR5WMHVVKQ8yI10yTbvyjOhG7G6dYDsQzDB0IxJL6vAk2nlyalc9RZdpGKwMasoyAsEMB+vOuOKOJcAtKwcIZjhYd8yVlHKCoUQH05UzAsEMB5tSrruGbJBoCd2XZQDBDAcf8O92Yw0mAav95QDBDAf7ZvYshkG7ckYgmKLEw5PY3SNdi2GoXXkygpUZFgimOOwXjPro6QvqGoZ1IcQxGYBgiuNNhizBUNuGduUMQDDF4ddgXBXMAlyyYYFgisNXKeu/mLVhEDJrMcFZIJji8BbGsQxZQqSPYWi6cmqZDzgLBFMc9o3sqmBoQ0FNuzIBK2MAgilCXN3LDk+i6mBXwbDY4YBgisF+sVzNkCUYUssQjAEIphjsF8u1GrJBDAkJdgo0iIFgisFW97puYQx/PlgYAxBMMdgvVl3Dk7JiSEgg6DcAwRSD/WK50pbMQQmJVlvbrryirkEKEExe4rUK71LKWzH8GeGWaYBg8sOKZWx6s7bhSXlAHFMcCCY/fPzigXUhDOtEKMLUAMHkh7UwrmfIEjAstjgQTH7YtQpXiy4HgUtWHAgmPwFYGO2fc1HEIzxAChBMftg3sOur/Ak0goNGcWhgXwpNB4LJQ/zmZTeL8MXCEIYRGIfUGQwAweRDa11ao+qDBxgyetjYjwGCyQcrGFdmwWQF7crFgGDywa5R+LIGk4Ay/2JAMPngM2SepJQTDPEWTVdGu3IKEEw+vM+QJVAJD5XyaICVSQGCyQdrYVyvUk7D4EYitZwCBJOVbkRvXJprvwMankTz8H0jWtYKBiUyKUAw2fF+hX8QtCvnB4LJDuvT+5YhS4BLlh8IJjvsYp5rs2CyYljtR9CfAgSTHdan9y1DljA939O1K0/KuA1WZgAIJjvBxTCE4c8OKzMABJOFeDoXOzzJ1xiGgGDyAcFkg7UuNNXLxeFJWenoM2UowhwAgskG+6b12R0jUOafDwgmG/wsGM8Fg9RyPiCYbLAWZtrxnS5NGASPduUBIJhsaDJkfq7BJFC7siEtjsB/CxBMNoKNYQhsu5QdCMZEvNdwam8ILfrR4p/vGESPjf22AMGYYa2Lz+svW0G7cnYgGDNBrvBvBe3K2YFgzLAuia81ZIMYYpgV6ZamzvNsIhCMGdbCzDo8/DUPY1Px5AENWI9RQDBm2CxRKDEMYZzhD/pAMDrinVNoxHgqvq/BbKWjj8fQfamAYPSwb1ZyYciVCQVkyrIBwegJPkOWYLCWEIwCgtHDflF83FZJh+EFgKBfAcHoYX1318eL54UqFmi7KAZqV4aVkUAwetg3a0gZsgSU+puBYPQ0JoYhDH8nWBgJBMPRjaiHP3V40kirF8wq/1aiJW3gj9SyBILhYd+oJBafhidlBX0xZiAYHvYLEmL8QsAlMwPB8LA7poQYvxCGv9ecclMbDQTDw1uYwFLKCeRmdrCAqQWC4WEzZKEtWm7FYGUa364MwaTRjWgODPs2DTFDlmCIzxq/sR8Ekw4rlvakn8OTsmLo8YFLps5gO41a4d8KXDI9EEw6mhX+cHpg0jD8/fZLd7XR7coQTDpsH38obckc1OMzMQO3jAOCSSe44Ul5MLhljS7ChGDSaWwMQxjS5gfVuZFAMIPEw5PYDbhDXeXfSmcBi5ccEMxO2C/E1Nxmf/Pu0EFfDA8EsxNWME2wLkS0rP17XqQWdhsJBLMTNkPWhPiFoIVZTbsyiaWxVgaC2QlrYQy+fVAYrGlj4xgIZieNzpAlYNuldCCYnbCCCblKeRDDAm1jZ8ZAMFvpRiSW1OFJ5NNP7Qq36HIQ1JSlA8Fsh49fGuSOEYaKBgT9oA/iFwVZGNodh6Gx7coQzHbYBinD7vbBQe3KBivTSLcMgtkO65LN7m5OSjkBqeWdQDDbYd+aTXPJCINgGpkpg2AS4sYo1i9vpGAwM2YHEMxZ2ICfGqpCGp6Uldk9WjcUMUzDYd+YBtckWAx/72XVCtEoIJiz8GswDRVMe8LYrty49RgI5ixsEGvw5YPGUOrfOLcMgjkLb2EaGPAnGP7ujcuUQTBnwSp/CmhX3g4EQ8RlHqn7bVF5yEzgWyvpwOLldiCYGNYXb2qGLMHQ0nBAvmwa1a4MwcSwb8om7EOmg9qVaT9pBu2m7SECwcTwRZcNFwxhuAeNSi1DMDHsQ29ySjnBsOIPC9NA2IfepLZkDsNLo1E7YUIw3YhakpFS1mBIfMAlaxjsAx+b3hTjneb08XMgtXwWCEbzwGFdYmgdStOuPCOt9H51HTwQjC7gb/gazFYM96IxNWUQDIouMwG3LAaC0TxsWJizGBZwGzNdGYLRCKbpq/xbiZbQfUk0WzDdiAYnsV2DCPrPYrgXcMkaAhvwk3VpwvCkrBjc08a0KzddMJoq5ebtQ6aD2pUnI1iZpguGzZDBHduJoUwIgmkAvEs2D8EMYrC6l6hz0DRdMEgp58DwEoGFaQCshUGV8k6M3ZcNoLmC6Ub0Rkxtr6XhSdRpCLYTmWKYuPI7aJpsYVBDlhOq3Na0KxPBW5kmC4b1uZEh42n6sNgmC4bv40fRJUvTU8uwMClg0ZLHUMEdfGoZgkkBMQyP4d7AwgRJXPeE4UkFMNwbBP2Bwj5YGu9AdVMgHWpXbrW17cor6jpImioY1nXAgqWZJpf6N1UwfFsy4hcjTY5jYGEGQNGlGcNEtqBnxiCGGQApZTOzu7X3KOh2ZViYAZAhMwOXrEnEm86lFglS9qezgKJLEwbBLMp7THslBEkTLQzrMsC6ZIP2Opia096rYNdjmigYTfwCwWTFMALjkDoHRxMFw2ZxsA9ZdgzWONiN/WBhtoCtYbNjuFfBBv6IYbYAlyw7TS3zb5Zg4hZadjQD1mCyY3i50HTlINuVm2Zh2DcfDU8am1IfgBFqV6Z7piFIK9M0wSBDViJNLPWHhVFAMPmJlrX3LMgSmaYJBsOTSqSjL1QNsl0ZFkaBVf78GAP/AEEMo4BLlh/Daj+Cfq/pRtTDz84wwSp/fqbne7p25Ul5z4OzMk2yMOzD6yxuiNao+gByYbDMwVmZJgkGVcoVAMGEC1sQiPilOIZdQoMrwmySYPgMGfr4C9O0Mn/EMBJsrVScpq32N0Mw3YjmwLAWBhmy4hjc2eDalZtiYdg3Hc07wfCk4lC7suGFE1Tg3xTB8PELrMvQGNoigqopa7yFQQ/M8BjcsqA29muKYFB0WSGGLCNcMg/hXTKswQyNocwfgvEQxDAVYnBrV0Q3mlHX3hO+YOLhSWxqE6v8w0Ot3YZ25WDWY5pgYVjrQrs3UloUDI9xhn8gNFowsC7lYYgFg+m+bIJg2AwZ4pfyaMrGfk0QDOs/dxawBlMWhsAfgvEI9mHBwpSHwb1F0O8R7MNClXJ5ULvy6Li2XTkIKxO2YOKecnZ40tQuFF2WSRNK/UO3MOxDQoasfAz3FBbGAxC/WMQwLDaIIszQBcP2lKOGrHwM9zSIMv/GWhhUKZcPXDL/0QxPwhpM2RgEMyfizRS9JlzBxBWy7ANCDFM+tBkibYqowXsrE7KFYTNkEzMYnlQVBivjfRwTsmD4+AUBf2UYLLf3G/s1UjDIkFXH7G7tvYVL5jB8lTJ2uqwMuGT+glX+GjBkH/erZIy3NNMlQ4asMiiZQkkVDV67ZWEKJs73p77JRlo9MaP3s8GQGCy410WYoVoY1lfGPsrVY2ibOKjOXhKqYJBSrpFpfVIFFsZB+KJLWJjKCbldOVTB8BkyFF1WjnEnzHj8iJc0ziVDW3L10PgQzX5vJBZv3bLwBNONqCWZfSBwyewwo28m89YtC9HCsGKh4UnjHfTx2yDUOKZRgkEPjD0MNWXetiuHKBiklB0g1JqyEAWD4UkOYFggRtDvEKyFwSq/PcjCjIyoDzvxtl25YTEMBGMLalee1u9d7aVbFpZg4pnw7PAkpJTtYnhBeZkpC83CsNaF3DEMT7KLQTBeZspCEwxr5pFSto8hyeJl4B+aYPi2ZLhj1pndo31JHVJnr2iOS4Y+fusYXLJlGXPSwF6vaIxgkCGzT3tCiMmO+pCOd25ZaIJhMy+oUq6H2b3r6ioV71LL4QgmnnCV2mdBk7Go5BzYxxA7epcpC8nCsOYdAX99GAbvercW0wjBIH6pj9AWL0MSDJ9SRtFlbRhixwPSlfaqXTkkwbBvKyxa1gfFjuNj7NeMxOKVlWmIYGBh6sRQhOlVajkMwcQLYBie5Cgzy2fUVSqwMDXAvqVon19aQAP1Yagpu0SdvSB4wWDBsn5CypSFIhj2LYX4pX4gGPdgbzqKLuuHpiVo2pVnZAy6X107T/AuGQJ+N4jO4RUj8aamLHjBYA3GDaaXTqurVLxxy/wXTGzOU4cntdo90VlA0aULGHbs8Wa6cggWhjXncMfcIVrSWnq4ZBZh3THsQ+YOhpcXXDKL8DtdIqXsDIZn4U27ctAWBlvDugNVW0xPaguTvbAyIQiGvdGwMG5haFeGYConHp60En/YCVLKbjG9tKauUvGipsx3C8O+lcamN8XYlPoAnCCE6cq+CwYr/B5hKISFS2YBVjCoUnaPyCSY2MV2Gt8Fw1cpI0PmHDRfdGxU+5Vz3i0LNoaBS+Ym0aK2CNN5tyxYlwyr/G4yve+kukoFgqmMeOQbuzqMNRg38b1d2WcLw2fIFjf6I+OAe/jefemzYFCl7CGGZ4Ogv0LYHgq4Y+5C7cotvl+Z2pXZyg0X8FkwfIYMffxOE3W0w0addssCjWEgGJeZOdffjf38FEy8gTUrGLhkbjO5fEpdpeL0zBhfLQyJJbW5oj2J4UmuM7tbW0UOC1MBfPyCDJnzGDwAp/v7fbYwqUAw7mMQzKJ0uRfVtXP4KhjWzzWYe+AAo2PyxTaubVd2dj0mPJcMAb8XLCxoRyocUmfnQAwDamF8/wl1lYqzG/v5J5h4Ox7Wx0VK2Q+m9mhTy85myny0MOzNnIw2+/4xcB9f25V9FAwbEKIt2R8MngBNV3ayXdlHwbA9E4hf/IHalcdHtF8/J61MUBamo5/WCxxj1+y4ukrFydRyUDEMLIxfRCvanTCdXPEPysIgQ+YX40va1LKTRZh+CSZuLkoNBml40vQ8ii59wvCCQwxTAuxNhHXxD8Pe1xBMCSB+CQgapzjCOwWT0qNwLvD3TTBsyQRqyPxk15S2psw5KxOOS4atYb3kHH0RJgQzJLxgMAvGSyZWVtVVKs4VYfojmG5Eo8VpxHgqiGH8ZOrcZ9VVKs6V+ftkYdgAcGIGw5N8xfCiQ9A/BKw7ho3H/cWwHOBcu3IQFgZVyv5C7RjTLX+mK/skGL5KGTtdes38Lm2mzKmasiAsDFb5/WZ2RbsTplM1ZUHEMMiQ+c3YuU+rq1ScCvz9EEw8PInSyjsYafX6O8IDf4mWtc8PLlkB2JuGDJn/GDyEFbUG5wS+CAbxS8BQu3J7Uzss1hm3zBfBsIEf4pcwmJvW7nnhTGrZfwuDossgWNitTS07MyzWF8Foii4hmBCYOnBcXaUCC5MZDE9qBOPnaquWIZgcsDeLhidRwAj8x/DiQ9CfA411QQ9MKNAGJiP846R2ZSesjNcWBhmysJhpazfGdsLK+CAYzfAkCCYkzpl3P7XstYXBKn9YLO7VppadKML0PIaBYEKi/dwn1FUqTtSUuS2YuNuO7bhDDBMWE8vPqKtU4JJlgLUu5I5heFJYGF6Ac6pqvVZcFwxrhmFdwoNegJPr2q9k7VbGdcGw+1JhDSZM5jraTFntcYzrguEzZOjjD5KFJa1gat/Yz9sYBhmyMOlcpJ0ZA5fMAHuDIJgwGTvvqLpKBS4ZS1w7lLph1eh4T0ztQtFliBhi0/3ye1Fru7LLFoZ1x5AhCxfa8rd1Wn1Ip1a3zEvBwB0Lm1n9Ahv7vbCBy4Lh+/jRlhw0e/Z01FUqB9W5FlwWjCbgxxpMyCzsdXd+v5eCQQwTNu3nP66uUkEMs4M4E8LWDSGGCZuJfYYNMeJ9HmrBVQvDvkVoeFJb2zYBfKe/ZHCGXTbQbopSNa4Khr0hmAXTDKY2RtVVKrW5Za4Kht24DV2WzeCcSDuDsTbBaDe0rY1u9A/y56/FH7bz/CtPiQt+Sr+y5QvPPDkinnmq1T+ePdoSZ07Fj2PtREtsrguxKd8Np1bjdxr9s3V50LSCyagnz/ItHG32z5PJebYnWvKfd2SMF0lL7PNUg+//zYXimw+zHZifFFevvkNdW8VVwXxT/kydoPvSq54VS8+T3yZPOHNSiGOPjYoTR2JR/Egg8ujpN+Aemla713dho+WN/oYhs3s2xK7lTS/2cnv668vili+yE5Zvl4J5qbq2iquCoTRJas3Qq991XHQW3H3gJ55oiaceHhVHvz8qjj06Ko4/rvXFa4ESJwsrG2L3heti94H1vmVyjdUftsRXP8KWjR2TgplX11ZxTzDdiGbxPxJ/2A69Md/wp9qUo1U2zghxVIriqBLIUw+3+26Tb5DlIeEsnr/eF5ILrd+bG0J88epZ+dDZ+7lXiuawuraGi4J5nfx5ffxhO/RgX/V72o0SKofijsfvbYsn7muLJx9si43T/glEB72UEutz7qVnarU+1//BrNiYYe/va6Rg/l1dW8M9f+HyCRLMG+IP25k/b0Psu9Ru/EJW5Mj9o+KBr02Iu6+fFP9386R44t4xKZxR0dsISywExVUUX9EL4YGvjYunHorXCKnDVT8dvHyeuDkSJ0fZMqjbxM1rX1fX1nBRMFfJny+LP2xn+SLpc19QfR3Z+poQj317TNzzlQlx1+enxaN3jotj0uU6czI8gWjpSfEcbYnD94yJ+28d7ycu6A5Qap+yclVz8s5F8eTaKfVpB/dLwaR6IlXi3jegG9FNICuzg4O/eFKcd5l2RHVhyJL88Htt8fitc+KxR04LGwnZdqt9bKo9+cjJ9VN3r2+u/6/8pUflQT26R+ifS46pgzgiXZAT8v5Q0/vy+Oj42C9f/AuvvPLAz775C9+94Z4v33/TPatrx/fJf7YwMjJyWa/Xu6Qnerv6/2XJjE1vir3PXxc//uLTYtfe6u7U0599rrjlbjZMuUHej9era2u4KJgH5M+V+MN2Xv5bz/TdsrIgkRz7TiS+f+OMeOTYCdGrzt4+KI/b5XGHPO790XH1aiKGQkhR0J+YNoY4LEWyc8BKnECh9Dwt9L14RIxcLP+rS2VUUtrfdP7H1sX5P3m6b/1bJd+/tfvOETd+mnXBD8v7t1ddW8MtwcRvz5Pxh5289r3HS1lDePoHLfGDLyyJ+x6UIhkv/RaQhSBx0PFf8rhVPljr2RyWuLD1cnlcKY8r5FHKqjktnpLFOe9F5SUKaA3rSx+M1KdU5od96eTFNcHQJgd3xR+2Q27AlX+o3VFEy+lnRsSR6/aJu76+Ks6U2xVOf6gb5HGzPP5THnfLh+jPymo3Imt+hbQ+V0gXjkQ01//1grRkbLP30tN9qzO3b3h37dr3yYc1xQZML5X3ml5M1nBNMG+WP/85/rCduf3r4hW/za78sqx+Y4/49r9siidbMpIfLe2ve488rpXHl+Rxk1cCMdGNXiF//oY8fkke7L7WWdizb1RccMWqWDy/uBv95ffsEifnWIv1DnnvP6mureCaYN4vf14Tf9jOeS86LQ6+kc2YbINM+RP/dq64879PiHVtDV9m6De+SR7XyeNa+ZAoJgmb2D2m5AuJh87aHfZ0zM21xYErV8XyxfnfK3d84FzxyAbrWfy5fBZ/pK6t4JpgPi1/vi3+sJ2LX3NKXPhyfdEllaU8+vklce8D8ga3h/6r0dMlV+sf5fE5+WCK+4O+043ITSPr/1Z5UPxTiLkZKZyfyyecw584IG5/iO3ApOfyJnVtBdcEc5v8+ZL4w3Ze8pZn2Rv9w++2xSM3zovDR6TbNRz0G5AlSUSSpHdBQjeiXqV3yuM35VEo3pmZGhUXvvaE2PfCM8bM2uZXLhFf/GpqpRRxj3xGF6trK7gmGNr2MPUh/MzvnhDR0tkgklLCj35rTDx0y4xYXR061XyrPD4lj89CJBmJs23kDZB4Cu1IOTMzKp5z5XGx7wW8xek9NSuu+0v2a0r/4ZR8ZtlN1pC4I5h4eBLbAPGGP1vtv41OHR8RD942Lh6+bUKcZhPQmaBU79/K41Pyht/d/xVQjG5E6WkSzs/LI3cBzdweIQ68mvcgrv3jWSH49P8LbD4/lwRD2Zlb4g/b6SxuiJe9/Vlx//+Mi4duHxeb64X/2PREKLtF1oSCd2tvpkYQp6jfLY/fkUfuJMHCyrp4zqvWdmTVrn/3jNiYZ1PLb5LP8XPqunJKXpsdgssnqOCS3lA7GJXvrHtvmRBHH2kXbbqikhPKvr1V3txPiJvX7pGHv+2IrnLz2jF5fEk+y4/LT5RZfKE8Mgvn5LGWePSO8X4/EVWmJwugR26KxMkx1u2+Q/6etP5lBZcE8xb586fjD9tZX5Mi6RUSCmW53iuPd0qhfFXe2PwLOSA/N6+dkMd/yGf6UfmJMjFUnpNZOFTw+fA3xsXTh1v9TtGRexfFkdPsksJh+Xv9q7quHJdcMvpL02LZsFCpBC1mfVSKhBYYQd3EaWnKqr1PHrnmVNIeBktRRxw+5ka7skuCoS/3MLPYKYj/sDw+Jm+g1foikJF4MZTimz+Rx1BVBFs4IZ/3rLquHDcEE+9kSFXKVF2bF8qQkFA+I29ctlIAUC+xxXmPPChBUGgtZ4Dz5LOnOLVyXBEMvXU+En/IDC0w/oW8UdYyJKBk4qUEsjaFsmpbeL38HlC8WjkW+uYyQW+arJBAXilv0KshFs+hReKrV39fXp0vD4o7i6b5rW3s54pgsrxdSByXyRtMeXdraURgAeoXijfmozKXz/R/LR/Wpiu7IpgdK7XTY1P9dZKLF5/3HXmi1VwSyrfo10CgXL1KXai0p8Nl8sjjPVgbFutKDLPS2hz53mar198Ra7Q3uv73v/rxG9bW1+779UNXUXAImkg3unxmvPPBE6ef+Qn1KxzW2pVdSiuTH/pucab3NjE2Qr4t+bWg4fR6vT1/d+c/Xff+67oHH117bHCLQVpKIO+Eqpbf1f8VAJoMCUYef3XXXXfdKK6aemj67Qt3iEvbfy1fsOU2mmdCiP8HZD50qp/8bSQAAAAASUVORK5CYII='
})

function srtTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        dataTime = '';
    const clock = document.getElementById('clock');
    minute = (minute < 10) ? '0' + minute : minute;
    hour = (hour < 10) ? '0' + hour : hour;
    let data = new Date().toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    });
    dataTime = data + ' ' + hour + ':' + minute;
    clock.innerHTML = dataTime;
}

function createM() {

    if (window.navigator.onLine) {

        if (ofpersonData) {
            ofpersonData.splice(0)
        }

        let DatePers = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/list_vessels/AG/555`), { fetcher });
        let personData = DatePers.Vessels
        let person = personData[0]
        map.setView([41.42698, 32.92053], 6)

        if (person.SPEED !== 0) {
            markerOptions = {
                title: [person.SHIP],
                icon: Ship,
                rotationAngle: person.COURSE,
                id: person.IMO,
            }
        } else {
            markerOptions = {
                title: [person.SHIP],
                icon: CircleShip,
                rotationAngle: person.COURSE,
                id: person.IMO,
            }
        }

        marker = new L.marker([person.LAT, person.LON], markerOptions)
            .bindPopup([person.SHIP] + `<br/>` + '????????????:' + ' ' + [person.LON] + `<br/>` + '??????????????:' + ' ' + [person.LAT] + `<br/>` + '????????:' + ' ' + [person.PERIOD])
            .openPopup()
            .addTo(map);
        markerArr.push(marker)
        ofpersonData.push(...personData)
        localStorage.setItem('ofpersonData', JSON.stringify(ofpersonData));

    } else {
        let ofpersonData = JSON.parse(localStorage.getItem('ofpersonData'))
        let person = ofpersonData[0]
        map.setView([41.42698, 32.92053], 7)

        if (person.SPEED !== 0) {
            markerOptions = {
                title: [person.SHIP],
                icon: Ship,
                rotationAngle: person.COURSE,
                id: person.IMO,
            }
        } else {
            markerOptions = {
                title: [person.SHIP],
                icon: CircleShip,
                rotationAngle: person.COURSE,
                id: person.IMO,
            }
        }

        marker = new L.marker([person.LAT, person.LON], markerOptions)
            .bindPopup([person.SHIP] + `<br/>` + '????????????:' + ' ' + [person.LON] + `<br/>` + '??????????????:' + ' ' + [person.LAT] + `<br/>` + '????????:' + ' ' + [person.PERIOD])
            .openPopup()
            .addTo(map);
        markerArr.push(marker)
    }
}

function startLoadTable() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        day = now.getDate(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        dataTime = '';
    dataTime = `${day}.${month}.${year} ${hour}_${minute}`

    if (window.navigator.onLine) {

        if (allRoute) {
            map.removeLayer(allRoute)
        }
        if (ofpersonData) {
            ofpersonData.splice(0)
        }
        if (ofcardData) {
            ofcardData.splice(0)
        }
        if (ofopenCardData) {
            ofopenCardData.splice(0)
        }
        if (ofcruiseInfo) {
            ofcruiseInfo.splice(0)
        }

        let DatePers = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/list_vessels/AG/555`), { fetcher });
        let personData = DatePers.Vessels
        let person = personData[0]
        let cardData = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/vessel_info/${person.IMO}`), { fetcher });
        let openCardData = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/vessel_card/${person.IMO}`), { fetcher });
        let cruiseInfo = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/cruise_info`), { fetcher });
        let cardO = openCardData[0]

        const SpeedIMG = document.getElementById('SpeedIMG');
        const Speed = document.getElementById('Speed');
        const TempIMG = document.getElementById('TempIMG');
        const Temp = document.getElementById('Temp');
        const Wave = document.getElementById('Wave');
        const WaveIMG = document.getElementById('WaveIMG');

        const Course = document.getElementById('Course');
        const CourseIMG = document.getElementById('CourseIMG');
        const TempWater = document.getElementById('TempWater');
        const TempWaterIMG = document.getElementById('TempWaterIMG');
        const WindSpeed = document.getElementById('WindSpeed');
        const WindSpeedIMG = document.getElementById('WindSpeedIMG');

        const PortDeparture = document.getElementById('PortDeparture');
        const PortDepartureIMG = document.getElementById('PortDepartureIMG');
        const PortArrival = document.getElementById('PortArrival');
        const PortArrivalIMG = document.getElementById('PortArrivalIMG');

        const spanArrival = document.getElementById('spanArrival');
        const spanDeparture = document.getElementById('spanDeparture');

        const distance = document.getElementById('distance');

        const Stay = document.getElementById('Stay');
        const Passed = document.getElementById('Passed');

        let re = /\r\n/gi;

        let SpeedTabHtml = '';
        let WaveTabHtml = '';
        let TemperatureTabHtml = '';
        let CourseTabHtml = '';
        let WindSpeedTabHtml = '';
        let mWaveHtml = '';
        let mTempHtml = '';
        let mSpeedHtml = '';
        let mCourseHtml = '';
        let mWindSpeedHtml = '';
        let TempWaterIMGHtml = '';
        let TempWaterHtml = '';
        let PortArrivalHtml = '';
        let PortArrivalImgHtml = '';
        let PortDepartureHtml = '';
        let PortDepartureImgHtml = '';
        let spanArrivalHtml = '';
        let spanDepartureHtml = '';
        let distanceHtml = '';
        let RouteHtml = '';
        let StayHtml = '';
        let PassedHtml = '';
        for (let card of cardData) {

            if (card.Wave !== null) {
                mWaveHtml = `<span class="anotherTxt">???????????? ??????????</span><span>${card.Wave} ??</span>`
            } else {
                mWaveHtml = `N/A`
            }
            if (card.Temp !== null) {
                mTempHtml = `<span class="anotherTxt">??????????????????????</span><span>${card.Temp} ??C</span>`
            } else {
                mTempHtml = `N/A`
            }
            if (card.Temp !== null) {
                TempWaterHtml = `<span class="anotherTxt">?????????????????????? ????????</span><span>${card.TempWater} ??C</span>`
            } else {
                TempWaterHtml = `N/A`
            }
            if (card.Speed !== null) {
                mSpeedHtml = `<span class="anotherTxt">????????????????</span><span>${card.Speed} ????</span>`
            } else {
                mSpeedHtml = `N/A`
            }
            if (card.WindSpeed !== null) {
                mWindSpeedHtml = `<span class="anotherTxt">???????????????? ??????????</span><span>${card.WindSpeed} ??/??</span>`
            } else {
                mWindSpeedHtml = `N/A`
            }
            if (card.Course !== null) {
                mCourseHtml = `<span class="anotherTxt">????????</span><span>${card.Course}</span>`
            } else {
                mCourseHtml = `N/A`
            }

            /* TemperatureTab */
            if (card.Temp <= 0) {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAN5SURBVFhH7Zi5SyxBEIdrN1BE1+etK4iwa+KZiEciBmbmmpqZairmJuKBiImIB4iBsQhiIt6o/4B4gqCo4AHueqD1qmprfLu6O9PjU1h474Oiuqumen4709M9sx4kIMnwqk8qklLUl27f4+Mj7OzswMXFhUY+U1RUBPX19ZCamqoRF7AoN1xeXmJ5eTn/EEerqKjAq6srrTTHtaienp64AhJZb2+vVprjek4dHByIp6sFu7u7CY3zzP7+vnhXqDhj2tra5ArU1tZqJD6c5+MCgQB2dnbizMyMZpz5cVHRZjq/vmVJOD8/h6OjI/EfSU9PB7pa0NHRAbm5uRq151tEFRf7IRgMiP9Ia2srHB4ewtTUFHg8Ho3a82+u6Jubm9De3g4jIyMacebHRZ2dncH8/Dx0dXUBTXSN2vPjorKzs4GeROju7oa8vDyN2uNaFD2x2jKjpaVFFtOhoaGfmegrKyuwuLioPTMWFhZgeXlZe4ZElitntra2MC0tTRbBgoICXF9f1wxfuj9mwXk+jo/nuu3tbc04YyQqHA6/vxn4/X6kdUcziHd3dzGi7u/vNYNI+yTSK4zU8RsDvfJoxh4jUYODgzIwzQmk26fRP0LimQXdPqnj+uHhYY3aE1WemKqqKhm0ublZI59FxDOLpqYm6gPW1NRoxJ6o0vjQniYDsk1MTEjs9vb2/cR2Zt3K8fFx6kfGODk5kZgdjk8fDaItALpi4rOyfol3IjPTJ96qY46Pj7WVGEdR9PqrLYD8/HxtuaOwsFBbseMlwlFU9Cp8fX2tLXdEby8mq7qjqGAwqC0AWmvEPzyExDsRCoXF0xonnikrK9OWDTq3bKmsrJRJ2tDQoJH4E/ujMW9vb1hXV0d9wOrq6kjQAS21p7+/XwZlm5ub0+hnEdFmMTs7S/1I7cDAgEbtiSpPTCgUwpKSEhnY5/Ph3t6eZhCfn5/fhbC9vLxoBpE2YszIyJC60tJS2RlMMBLF0GaMKSkpcgI+0fT0NL6+vmo2Fo5PTk4ivZ/L8Vy3tramWWeMRTF8KyxhbDxH+vr6cGlpSa4Ke+5bOwAbfbbH3HITXIliVldX5VvOOqmd0ZOGGxsbWmmOa1HM09MTjo6OytPo9XpjhHC/sbERx8bGZL59hb/+04wX1NPTU7i5uYGcnBygCW38fZeI///kmZKEogB+AzAU/LyQVthtAAAAAElFTkSuQmCC">`
            } else if (card.Temp > 0) {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAOPSURBVFhH7ZhNLCRREMdr5mB2fCTrm2QHwR6M4bA2w2kcHDZx54iTK1dxd0REXH2EkDiLRByI7+BAXHbWZ1ZCsCtIfGZS+6q2Wow1/V5bEsnuL3mp6qp+3f95/bre63GhAt4YbrFvijcp6lmP7/r6GpaXl+Hw8FAif5KVlQXBYBA8Ho9EHECinHB0dIRFRUX0Q7TN7/fj8fGx9DTHsaiWlpYnBcRqra2t0tMcx3Nqc3OTrRotWFlZidkoT4TDYbaOEHHG1NTU8AiUlZVJ5GkoT+fl5+djY2MjDgwMSEbPq4t62Ezn14uUhIODA9je3mb7mISEBFCjBfX19ZCamipRe15ElCcYgveVX9g+prq6Gra2tqCvrw9cLpdE7fk3K/rCwgLU1tZCV1eXRPS8uqj9/X0YHR2FpqYmUBNdova8uqjk5GRQbyI0NzdDWlqaRO1xLEq9seKZUVVVxcW0o6PjdSb69PQ0jI+Py5EZY2NjMDk5KUeG/C5XehYXF9Hr9XIRzMjIwLm5Ockg/vhQeN8sKE/n0fnUb2lpSTJ6jERdXV3d7wyys7NR1R3JIJ6dnUWJOj8/lwyiWidRbWG4H+0Y1JZHMvYYiWpvb+cLqzmB6vFJNHqEHjcL9fi4H/Xv7OyUqD1Gm7ySkhLY2NiAyspKmJqa4thP30e2dqR8/8Y2FArBzMwMlJaWwtraGsfs0E70nZ0dFkTU1dWxVY+MrY6Liwu2Vr/19XXY29tj3w6tqN3dXfEAAoEA20jgM1sdd/5PbK1+BP1IHVpRavsrHkB6erp4zsjMzBQv+nqx0Ip6WIVPTk7Ec8bD5cWkqmtFFRQUiAegag3bd1/1k5XwhtfZqhrHligsLBQvNlpReXl5UFxczP7g4CDb+Ph4tjpU0eRlyepHb3FOTg77dmhFEQ0NDWxppEZGRti3XvdYWPnh4WH+RiSs62ihOqXj8vISfT4fF8CkpCRcXV2VDOLt7W1U0by7u5MMolqIMTExkfvl5ubyymCC8dqnFmOMi4vjG9CN+vv7MRKJSDYaivf29qLan/P51G92dlayeoxFEUNDQ/fCqKk5gm1tbTgxMcGjQpaOVV26P0d9tqN6hHIFMxyJItRywd9y1k3tmnrTcH5+Xnqa41gUcXNzg93d3VheXo5utztKCB1XVFRgT08Pz7fn8Nd/mlFBpfXs9PQUUlJSQE1o4++7WPz/J8+UNygK4Bflp3G4eU+s+QAAAABJRU5ErkJggg==">`
            } else {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAMqSURBVFhH7Zi7S2tBEIcnKRSJKXxrEQJq47MRH41Y2Nlrmy6ttmJvIz4QsZHgAySFtQhiI75R/wHxFbAQFQQLTRQdZ9YxREz2zN5LIHDvB8vOmT2z55c9u7N74kMCCgy/1AVFQYr6o9eXTCbh+PgYbm9vxfOb2tpa6OrqguLiYvE4wKJcuLu7w6amJv4hnqW5uRnv7+8lUo+zqNHR0awCcpWxsTGJ1OM8p87Pz01NowUnJyc5C7czZ2dnpnZCxKkZHBw0I9DR0SGe7HA731dfX4/RaBRXVlakxZu8i8os2vmV95QQCASARgsikQhUVFSI107eRQ0MDMDFxQUsLS2Bz+cTr51/M6MfHBzA0NAQzM7OisebvIu6ubmBtbU1GB4eBpro4rWTd1FlZWVAKxFGRkagsrJSvHacRdGKFUtHf3+/SabT09P5mejb29uwsbEhVzrW19dha2tLrpR8pStvDg8PsaSkxCTB6upq3Nvbk5bscDvfx/dz3NHRkbR4oxL18vKSPhnU1dUh5R1psUP7JNIRxsTxiYGOPNJiRyVqamrKdExzAun1iVcHvT4Tx/EzMzPitaMS1draajrt6+sTjxu9vb0mvr29XTx2PEVdXl6aDrnEYjHx6nh6ejL1wsJCuo/r62vjs+G5+qgTsQBoxMTSEQwGTZ0Zd3V1JVZuPEXR8VcsgKqqKrHcqKmpEetnf7nwFJWZhR8eHsRyI3N70WR1T1ENDQ1iAVCuEcsNynFiATQ2NoplQeaWlZaWFjNJu7u7xaPn4+MDOzs7TXxbW5t47ahETUxMpFdPPB4Xr47V1dV07OTkpHjtqEQ9Pz9jKBQyHdOKwtPTU2lBfH19FeuLt7c3sRBpI8bS0lITFw6Hzc6gQSWKoc0Yi4qKzAP4QcvLy/j+/i6tP2H/4uIi0vnc3M9xu7u70uqNWhTDr+JbGBeeI+Pj47i5uWlGhWu+/t4BuNBnu/MrdxLF7OzsmG+574faCq003N/fl0g9zqKYVCqFc3NzZjX6/f4fQvi6p6cH5+fnf803LX/9pxkn1EQiAY+Pj1BeXg40odXfd7n4/0+elgIUBfAJFX9R6wJOQlwAAAAASUVORK5CYII=">`
            }

            if (card.Temp <= 0) {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAN5SURBVFhH7Zi5SyxBEIdrN1BE1+etK4iwa+KZiEciBmbmmpqZairmJuKBiImIB4iBsQhiIt6o/4B4gqCo4AHueqD1qmprfLu6O9PjU1h474Oiuqumen4709M9sx4kIMnwqk8qklLUl27f4+Mj7OzswMXFhUY+U1RUBPX19ZCamqoRF7AoN1xeXmJ5eTn/EEerqKjAq6srrTTHtaienp64AhJZb2+vVprjek4dHByIp6sFu7u7CY3zzP7+vnhXqDhj2tra5ArU1tZqJD6c5+MCgQB2dnbizMyMZpz5cVHRZjq/vmVJOD8/h6OjI/EfSU9PB7pa0NHRAbm5uRq151tEFRf7IRgMiP9Ia2srHB4ewtTUFHg8Ho3a82+u6Jubm9De3g4jIyMacebHRZ2dncH8/Dx0dXUBTXSN2vPjorKzs4GeROju7oa8vDyN2uNaFD2x2jKjpaVFFtOhoaGfmegrKyuwuLioPTMWFhZgeXlZe4ZElitntra2MC0tTRbBgoICXF9f1wxfuj9mwXk+jo/nuu3tbc04YyQqHA6/vxn4/X6kdUcziHd3dzGi7u/vNYNI+yTSK4zU8RsDvfJoxh4jUYODgzIwzQmk26fRP0LimQXdPqnj+uHhYY3aE1WemKqqKhm0ublZI59FxDOLpqYm6gPW1NRoxJ6o0vjQniYDsk1MTEjs9vb2/cR2Zt3K8fFx6kfGODk5kZgdjk8fDaItALpi4rOyfol3IjPTJ96qY46Pj7WVGEdR9PqrLYD8/HxtuaOwsFBbseMlwlFU9Cp8fX2tLXdEby8mq7qjqGAwqC0AWmvEPzyExDsRCoXF0xonnikrK9OWDTq3bKmsrJRJ2tDQoJH4E/ujMW9vb1hXV0d9wOrq6kjQAS21p7+/XwZlm5ub0+hnEdFmMTs7S/1I7cDAgEbtiSpPTCgUwpKSEhnY5/Ph3t6eZhCfn5/fhbC9vLxoBpE2YszIyJC60tJS2RlMMBLF0GaMKSkpcgI+0fT0NL6+vmo2Fo5PTk4ivZ/L8Vy3tramWWeMRTF8KyxhbDxH+vr6cGlpSa4Ke+5bOwAbfbbH3HITXIliVldX5VvOOqmd0ZOGGxsbWmmOa1HM09MTjo6OytPo9XpjhHC/sbERx8bGZL59hb/+04wX1NPTU7i5uYGcnBygCW38fZeI///kmZKEogB+AzAU/LyQVthtAAAAAElFTkSuQmCC">`
            } else if (card.Temp > 0) {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAOPSURBVFhH7ZhNLCRREMdr5mB2fCTrm2QHwR6M4bA2w2kcHDZx54iTK1dxd0REXH2EkDiLRByI7+BAXHbWZ1ZCsCtIfGZS+6q2Wow1/V5bEsnuL3mp6qp+3f95/bre63GhAt4YbrFvijcp6lmP7/r6GpaXl+Hw8FAif5KVlQXBYBA8Ho9EHECinHB0dIRFRUX0Q7TN7/fj8fGx9DTHsaiWlpYnBcRqra2t0tMcx3Nqc3OTrRotWFlZidkoT4TDYbaOEHHG1NTU8AiUlZVJ5GkoT+fl5+djY2MjDgwMSEbPq4t62Ezn14uUhIODA9je3mb7mISEBFCjBfX19ZCamipRe15ElCcYgveVX9g+prq6Gra2tqCvrw9cLpdE7fk3K/rCwgLU1tZCV1eXRPS8uqj9/X0YHR2FpqYmUBNdova8uqjk5GRQbyI0NzdDWlqaRO1xLEq9seKZUVVVxcW0o6PjdSb69PQ0jI+Py5EZY2NjMDk5KUeG/C5XehYXF9Hr9XIRzMjIwLm5Ockg/vhQeN8sKE/n0fnUb2lpSTJ6jERdXV3d7wyys7NR1R3JIJ6dnUWJOj8/lwyiWidRbWG4H+0Y1JZHMvYYiWpvb+cLqzmB6vFJNHqEHjcL9fi4H/Xv7OyUqD1Gm7ySkhLY2NiAyspKmJqa4thP30e2dqR8/8Y2FArBzMwMlJaWwtraGsfs0E70nZ0dFkTU1dWxVY+MrY6Liwu2Vr/19XXY29tj3w6tqN3dXfEAAoEA20jgM1sdd/5PbK1+BP1IHVpRavsrHkB6erp4zsjMzBQv+nqx0Ip6WIVPTk7Ec8bD5cWkqmtFFRQUiAegag3bd1/1k5XwhtfZqhrHligsLBQvNlpReXl5UFxczP7g4CDb+Ph4tjpU0eRlyepHb3FOTg77dmhFEQ0NDWxppEZGRti3XvdYWPnh4WH+RiSs62ihOqXj8vISfT4fF8CkpCRcXV2VDOLt7W1U0by7u5MMolqIMTExkfvl5ubyymCC8dqnFmOMi4vjG9CN+vv7MRKJSDYaivf29qLan/P51G92dlayeoxFEUNDQ/fCqKk5gm1tbTgxMcGjQpaOVV26P0d9tqN6hHIFMxyJItRywd9y1k3tmnrTcH5+Xnqa41gUcXNzg93d3VheXo5utztKCB1XVFRgT08Pz7fn8Nd/mlFBpfXs9PQUUlJSQE1o4++7WPz/J8+UNygK4Bflp3G4eU+s+QAAAABJRU5ErkJggg==">`
            } else {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAMqSURBVFhH7Zi7S2tBEIcnKRSJKXxrEQJq47MRH41Y2Nlrmy6ttmJvIz4QsZHgAySFtQhiI75R/wHxFbAQFQQLTRQdZ9YxREz2zN5LIHDvB8vOmT2z55c9u7N74kMCCgy/1AVFQYr6o9eXTCbh+PgYbm9vxfOb2tpa6OrqguLiYvE4wKJcuLu7w6amJv4hnqW5uRnv7+8lUo+zqNHR0awCcpWxsTGJ1OM8p87Pz01NowUnJyc5C7czZ2dnpnZCxKkZHBw0I9DR0SGe7HA731dfX4/RaBRXVlakxZu8i8os2vmV95QQCASARgsikQhUVFSI107eRQ0MDMDFxQUsLS2Bz+cTr51/M6MfHBzA0NAQzM7OisebvIu6ubmBtbU1GB4eBpro4rWTd1FlZWVAKxFGRkagsrJSvHacRdGKFUtHf3+/SabT09P5mejb29uwsbEhVzrW19dha2tLrpR8pStvDg8PsaSkxCTB6upq3Nvbk5bscDvfx/dz3NHRkbR4oxL18vKSPhnU1dUh5R1psUP7JNIRxsTxiYGOPNJiRyVqamrKdExzAun1iVcHvT4Tx/EzMzPitaMS1draajrt6+sTjxu9vb0mvr29XTx2PEVdXl6aDrnEYjHx6nh6ejL1wsJCuo/r62vjs+G5+qgTsQBoxMTSEQwGTZ0Zd3V1JVZuPEXR8VcsgKqqKrHcqKmpEetnf7nwFJWZhR8eHsRyI3N70WR1T1ENDQ1iAVCuEcsNynFiATQ2NoplQeaWlZaWFjNJu7u7xaPn4+MDOzs7TXxbW5t47ahETUxMpFdPPB4Xr47V1dV07OTkpHjtqEQ9Pz9jKBQyHdOKwtPTU2lBfH19FeuLt7c3sRBpI8bS0lITFw6Hzc6gQSWKoc0Yi4qKzAP4QcvLy/j+/i6tP2H/4uIi0vnc3M9xu7u70uqNWhTDr+JbGBeeI+Pj47i5uWlGhWu+/t4BuNBnu/MrdxLF7OzsmG+574faCq003N/fl0g9zqKYVCqFc3NzZjX6/f4fQvi6p6cH5+fnf803LX/9pxkn1EQiAY+Pj1BeXg40odXfd7n4/0+elgIUBfAJFX9R6wJOQlwAAAAASUVORK5CYII=">`
            }

            /* WaveTab */
            if (card.Wave === 0) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAlhJREFUWEftmCFzAkEMhbedwYDBgACDwYDBYMBg+L8YfgIYDAYEGAwIMBgwiLZfSjo7ud3jrjXHlGeuk/CSbJJ3e9O3jy+4guH9/iwUCllUdHy3280tFgt3PB7daDRy1Wr17nFuv9+Lr9lsul6v50qlktjhLJdL8Q+HQ1er1cQOTqeTm81mCU4IiaIIeDgcJMjlcrlbnSSo1+tSJD5FpVL5SZ6X02g0pEiLRFGTyURODFqtlpBXq5W7Xq9iA+Vy2XW7XUm02+3u1m/k4dD98Xgsf/tIFHU+n6UoCP5YsNMFvzMAGz4AB79CO2c5Go9C/d8rnu+VwIn8HfGh3bHQLoSAHf8jRDtFABTGs9/vy64o2Jf1ei3jQpk6Zg4wn8+Fg8La7bbYwXa7FWXCGQwGwbEpEkWREPXZ0xKEHQidln0JdSiNQ3Ec1C9ckShqOp2KalQtBKZQX9IE63Q6oiI6oAnpGB0iIV3xORROxznwZrORHPwuk/pi0E74KlJgpyA7kjROGv6P+vJyLKKdUiXxZE989flKiqnPKvbP6mNB/SUFqiQW1HZCdyYvh3svk/r07ktTHwHpHpe3VR9JSBZSn+Vgo9MWiaL4sY7DB3bGQvutX3cFn480TiwPeE71xRSDHb/FbzgWD9VHoKz3WFYOyrSj9pEoCjLXhz0t8ydQ6LSaIC/n13cfZKskPmPpROjuIwnJ+MIIqY8CUTM5MqsvDSQhkIW+g0IvxBgnDc+pPvsmVtj9UcCJ+UK7FUK0UwR4fXl6eKg+Atu7j2CvL88ioJD/dXkVlQ3OfQKagd1rxtVE5QAAAABJRU5ErkJggg==">`
            } else if (card.Wave > 0 && card.Wave <= 1) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKPSURBVFhH7ZWxjhNBDIapeAN4Ah4B3gCegIIaKOmhPiQqoAFEAw2CKldEQglFmgBKClKBlDRpckUKlCYUkZDSzOmbHUdez3jZpDgOcb802h3P/Pbvta29FM4hLkS1hStqu92G8Xgcut1uWK/XyVphuVxG+2QyifcEvGPjbLVaJWsF9iVOCZkoAkLs9/uh0+ns1nA4DLPZLD61nXvcP4RDrBIyUWQjZIiLxSL0er2aU/bYOdd21j6cwWCQotaRiaJUfGpbFmw4tWXZbDYxYxbvGh5H/Nn7gn+r0QEZednY5hfA8c6w6wp4cEXhgJpTe0qgMZ1Odz2hg5CAcObzebJWYC8cL1FBJoqA4lgvJoYp0oMgC/u+HO5b4YJMlEyNTAsNaUeaCSJbEtABeYfDV7Yc9nAQIjEQVkLrRpeJKQERpZI0cZrQWtRZolEUmXpN6U3YIRwLVxSOqbn0iYaeJG/6mjieaEEmiua1TcqSSbL/Nxb2Qzitp0+mqWn62FOK0vRh86bPcrCVkInS5dCQSSqdE6zUL00cLw5obPS/hUZRZFP6AgC79wX25Vi4ovQk2Yb0JqktxxMtyERBFsd60Zw0pm5sWdw/hGOFCzJR9t9HVnaSRqNR/Cre9HFmOezxhU+Jga2EvRrd+48hQpdR4//49603v8PJ6lfa1fF98TO91QHHO8PO+Z/gisLBjUdvw+U7T8K7zz+StcLj46/RzrkWrTkvP02StYLHKSETBVkc63X13vNw6+hDfNoz7h/CedH/lqLWkYm69uBVJPHkC32ZnYSbR+9rDu+//hizJYErd5/t7MLhi1nO7afHkcO5xLj+8E2KWkfrRqcXEFgCwbySeJwmtBZ1lrgQ1RbnUFQIpwcTzGG6g5S/AAAAAElFTkSuQmCC">`
            } else if (card.Wave > 1 && card.Wave <= 2) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuRJREFUWEftlT9sUlEUxo8mGANDGYQmkFgWHCC1DOIAsbKwmLhpnBoXR91MnLrYODg4GTcXu9aBxODiIm1gEAcw4Q0w+GgCUTAREkENA/Y73KuX+/4U4kJTfsuDc95377nn3A/OjI+gBeOseC4UC1mU4/hGoxGVy2XqdDqUyWTI7/eLDFGr1eJcOBymRCJBHo+H49BUKhXOp9NpCgQCHAfdbpeKxaJFY4elKCzYbrd5kcFgIKLEGwSDQS4SOYnP5/u7+byaUCjERepYisrlcnxiEIlEWFyr1Wg4HHIMeL1eisfjvJFpmiI6YR4Nup/NZvmziqWoXq/HRUGgjgVxdEHtDEAMOQAN8hLZOV0j10Oh6vuSk/eTgBOpd0RFdkdHdsEOxJE/DsdOYQE4DM9kMsl3RYL7YhgGjwvOlGPGAUqlEmvgsGg0ynHQaDTYmdCkUinbsUksRWFDuE8/LRbBHbA7Le6LXYfcNCgOB1ULl1iKyufz7BrpFiyMQlVLY7FYLMYuQgfkhugYOoQN0RVVg8LRcRy4Xq/zHnhvJvc5ITuhukiCOArSR+KmceP0uG9ejY5jp6ST8MQ9Ud2nOsnJfbpj/9t9uKDqJQXSSbigeifknZlXg/+9mdwn//vc3IcF0T38eevuwybYzM59ugYxdFrHUhReluNQQRxjQfv1vLwryKm4aZz2ASfPfb3BL2p2++LbNFXzq/g0DTROOcSRPxZ0yo7K5y/j5KOX43N3noxfva+K6ITHe/scR97s9ER0WvP87QcRneCkscMyvp3XB/TmY91yWr/vPG2srVK1aT3tRmSVn/NqtjbX6cGNqyLyD0tR0fsv6PBbny5eWKHt29coEljhQveNQ/EG0db1ddq+tUm7hU901BHqD39zXGpQyMPdd1Oam1cu0bO7WSoYTdrZO+A9Lq8Fqfz0nnhDAUXNwvcfP8eFmim+TYNxOI3ESePG0n1L9y3dp7J0n3guFMuiZoPoD6eWky87VqyeAAAAAElFTkSuQmCC">`
            } else if (card.Wave > 2 && card.Wave <= 3) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAApZJREFUWEftmDFsUlEUho8mGANDGYQmkLQsOEBqGcQBYmVhMXHTODUujrqZOHWxcXBwMm4udq0DicHFRdrAUBzAhDfA4KMJRMHERyKoYXj2P9yr9/Heo5A40OR9y4Nz3n/vf869h4Fz5gm0ZJwXz6ViKU25Ht94PKZqtUq9Xo9yuRwFg0GRIep0OpyLRqOUSqXI5/NxHJparcb5bDZLoVCI46Df71O5XLZpnLCZwoLdbpcXGQ6HIkq8QTgcZpPISQKBwN/NF9VEIhE2OY3NVKFQ4IpBLBZjcaPRoNFoxDHg9/spmUzyRrqui+iERTTofj6f588qNlOGYbApCNRjQRxdUDsDEEMOQIO8RHZuWiPXg1H1fcnZ+0lAReodUZHdmUZ2wQnEkT8N105hAUwYnul0mu+KBPdF0zQ+LkymPGYUUKlUWIMJi8fjHAetVosnE5pMJuN4bBKbKWyI6ZuuFovgDjhVi/vi1KFZGphDoapxic1UsVjkqZHTgoVhVB1pLJZIJHiK0AG5ITqGDmFDdEXVwDg6joKbzSbvgffmmj43ZCfUKZIgDkPTRzJLM4uzN33G8Be1+wPxzUpd/yo+WYHGLYc48qeCTjlR+/zFTD9+ZV64+9R8/aEuohOe7B9wHHm9Z4ioVfPi3ZGITnDTOGE7vt03h/T2Y9NWbTBwkTbXV6netle7GVvl56Ka7a0Nenjzmoj8w2Yq/uAlHX8b0NqlFdq5c51ioRU2eqAdizeItm9s0M7tLdorfaKTjtBg9JvjUgMjj/beWzS3rl6m5/fyVNLatLt/yHtcWQ9T9dl98YYCTM3D9x8/zVJDF9+s4DjcjsRNMwtv+rzp86ZPxZs+8XTEmz4Fb/q86fvfLOW/Lp6p+SD6Ax1dauQOKl7UAAAAAElFTkSuQmCC">`
            } else if (card.Wave > 3 && card.Wave <= 4) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAgBJREFUWEftmDFoGlEYx/8NWIIOOlQFhXpLu0iiQ5JFYlxcAtlaOoUuHdOt0ClLQocOnUq3Ls2aDEIgS5aY4FIzaECHLj0FpT0LOaHaBIer3+e79s7zkgiBXOD9lnf3/+7/3v+9x+fgA2MIPMaMGD2FJ0O5Xt9gMEC5XIamacjlcgiFQqICtFotrsXjcaTTafh8PtbJU6lUuJ7JZBAOh1knOp0OSqWSwzMJRyiasN1u8yS9Xk+o4AUikQiHpJpJIBD4t/i0nlgsxiHHcYQqFAq8Y0JRFDbXajX0+33WCL/fj2QyyQupqirUEdN46PTz+Tw/W3GE0nWdQ5HBei2k0ylYT4YgjWoEeahuYp7cuMecj4Javze5fz8Jeu8CjU5XvNmpqj/Fkx3yuNVIp/q10ElNovL9h7H49rPx8MU748tRVagjtnaPWae6qulCtXs+HnwV6gg3zyQc17e9d4L902+O3YYCs0gloqg2nLtNKVEep/WsZ+fwenVJKP9xhHqy8QnNX108fhTE5vNlKOEgBz2uN8UXwPrKHDafZbFTPMPwRNDtX7JueijIm51Dm2dt4Sk+vMyjWG9ge/eE15hPRFB+/0p8YYFC3YTz33+MYk0Vb3boOtyuxM1zFbL7ZPfJ7rMiu0+ME5HdZ0F2n+y+20Z2n+w+2X13hSf/dZGhbgbwF7U6QrfdVU62AAAAAElFTkSuQmCC">`
            } else if (card.Wave > 5) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAThJREFUWEdj/A8EDIMMMEHpQQXwOurD1x8MD19/hPJQwcUHL6EsVADSg0sOJA6SJwhA0YcNXLj/4r9p+Zz/bOGt/xceuAgVhYCm1YfA4iD5B68+QEVR9UzedgoqCgG49GADGGmqec1hhs1nbmH4VoCbg0FfXpzh4kNM3+oriINpUvXE2uky5HqZQUUQAMNRqjlTGR69+cggJ8LPUBtqy6Agyg926KFrj6AqGBhi7XUZakPsGBYdvMQADBGGj99+gsVhekAOKVm0G0WPr4kaQ2+8K8PBaw8ZmlcfBtuhJy/GcLozBaoCCYAcRQx4/+X7/4NXH0B5qAAUHbiiBJcefGDoFQmjuQ8JjOa+0dxHbTCa+0Zz32juGygwmvtGc99o7hsoMJr7RnPfaO4bKIA39w0UGHUUcYCBAQBxwB+sWvdkLAAAAABJRU5ErkJggg==">`
            } else {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAlhJREFUWEftmCFzAkEMhbedwYDBgACDwYDBYMBg+L8YfgIYDAYEGAwIMBgwiLZfSjo7ud3jrjXHlGeuk/CSbJJ3e9O3jy+4guH9/iwUCllUdHy3280tFgt3PB7daDRy1Wr17nFuv9+Lr9lsul6v50qlktjhLJdL8Q+HQ1er1cQOTqeTm81mCU4IiaIIeDgcJMjlcrlbnSSo1+tSJD5FpVL5SZ6X02g0pEiLRFGTyURODFqtlpBXq5W7Xq9iA+Vy2XW7XUm02+3u1m/k4dD98Xgsf/tIFHU+n6UoCP5YsNMFvzMAGz4AB79CO2c5Go9C/d8rnu+VwIn8HfGh3bHQLoSAHf8jRDtFABTGs9/vy64o2Jf1ei3jQpk6Zg4wn8+Fg8La7bbYwXa7FWXCGQwGwbEpEkWREPXZ0xKEHQidln0JdSiNQ3Ec1C9ckShqOp2KalQtBKZQX9IE63Q6oiI6oAnpGB0iIV3xORROxznwZrORHPwuk/pi0E74KlJgpyA7kjROGv6P+vJyLKKdUiXxZE989flKiqnPKvbP6mNB/SUFqiQW1HZCdyYvh3svk/r07ktTHwHpHpe3VR9JSBZSn+Vgo9MWiaL4sY7DB3bGQvutX3cFn480TiwPeE71xRSDHb/FbzgWD9VHoKz3WFYOyrSj9pEoCjLXhz0t8ydQ6LSaIC/n13cfZKskPmPpROjuIwnJ+MIIqY8CUTM5MqsvDSQhkIW+g0IvxBgnDc+pPvsmVtj9UcCJ+UK7FUK0UwR4fXl6eKg+Atu7j2CvL88ioJD/dXkVlQ3OfQKagd1rxtVE5QAAAABJRU5ErkJggg==">`
            }

            SpeedTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAADL0lEQVRYhe3Yy4tcVRAG8N+MyYx5OJlEiAM6DoKPwCjiAxKVEVyIaEQQBV0ZxagQF/oHGCGuxE2CCUnAjAtRia7UXRw0WWkWahBRJIEBMeJjoUl0Eds47aKqnTvt7cftdLvKB83l1Kn66ut7Tled01zA/4+L+0U01EPMRbgL9+BWbMA6jKCGX/EtPsMhHMbf/RBbhnXYgZ9Qx+84gj2YTdtsjo/kfD39d2R83zCM53Aa5/AO7hVvpoGZFDBTsI3gPrybcaeTZ/h8BU2Ib10XS3Cghd849uWzDAcyvi6W87JeBW3APE7hEezEX7iiIs9kxu3Eo8k3j+uqCprCD/ge02kbwwtYWZFrZcaN5fh6nEz+K7slWY2v8TOuriigW1yDXzLP6m4C9onXffuABDVwR+bZ28lxBgv4QB9+JR0wnHkWcGc7x8OiANbxCZYPSNByfJp5apm3FLel09N4GPtF9e431ibv/szzTObdWOa8B7/pYw8rYBW2YA6PNc2tEIX11bLAH/FGH4UMiT36Os5k4rtb+L4pSsQSXCVe4ZYekk9iF97DK9gk6tKJ5KyLunRjG44n0m+qaHwojdNlEW2wUVToP3Asn/Wmz1cpvB1uSN8Hi8Zn0zhWFtECQ/hGFMCJtE2krSHoY637YRFj6b+taNwu6sUc3seaLoiuTaLHm+yNpXjL0pNEGdaIWjWX+bezWCAXLB74ajnuhIZPc9lojF9Mrk4ctcw91Jz3KfHt1nYhpoEhfInjFhvrlNjgxyrwwKWZf2vR+EAa2/1CynCTaKw1cQSu5bgXnjruLxon0/hkRTJYj5dwMJ/re+BorNTlzRMn8HYPhP3AQbEN/oPdovJWPcSdL1aJS8busslpsfu3YTNew+iAhIyK9rNZ1MgFbQr3Rzgr1vdz0SwHgRX4IvOcFXWqJW4R16EPsWxAghpYlnnO4ebiRNkNeZdYwkvwZ8E+JW7FveIQviuMR8Ve2ovnOwWPiE7fjMYtuNfPbAnnJiWtqGyJajjaQuzxFoI74WhZ8hZ5Ku+bcXFcropuTgr/ooqoeVGtX64kZ2l8V6j6V9B4DzHEnjrVQ9wFtMU/4EXK79J36HYAAAAASUVORK5CYII=">`

            CourseTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAADX0lEQVRYhdXYz29VVRAH8A/EmtgHNDEgGqMbtepKaglqIhQksQkY9upCV4grNYFoIqiARoyJ+CfoRhPagi7dqLgkRaAmim38VULU+AOCdlGK1sWZy7uW9+6755WFfpObuee8mTnfd37MzLn8B7FkEbbLMIB+rMQKXMCvmMQJ/LlYgnXQh6dxFBcxX/FcDL0dYXfV0cB+nI8Bv8JebMVd2BT9G6O9FftwOvrPh37jahHajOlwPoI1LXSuxRPoafHbAEbD/gc8tFhCL+AvnMSDFXpL8UjIdliPCVzCrm4Jvak5O70ddIdDd7iDXgNjoftGLqHnw/At9U7o7tDfXUN3CQ6Gfu0Z2ywt2UhNQnAkBjlSU3+pNGOXpENSiWXSZjyp85KVcSZIncmwaUh77PtOY+3H36o39UKsDkJfhlydYbshbPa2U+iT4slIhlPYEo6fDbkl034M57QJsDvCaas4VIU9mMP1Ifdk2t8b4z7V6sfPpEidiw9wKt5PRTsXk/i0aBTBbjnux6EuHK7FeLyPRzsXh/CAdNAuk1ojpYhjmc5uxM0lUsejfVOmn2NSqrqnTOrOkN9kOhsM+XmJFGmf5GAqZH+Z1MqQt2qdVNthrbS5y3tqTt4S9uCWeF8F10SjCF4f4Um8W9PhHVJh90yp70L018VjeCfeG2VSMyGH8UmGwyk8jgMt+uviPfwoTcgMzeX7LeS0NP11MZ7Z3wpzmunplzKpr0PeluGsavDjbfrboVju02VSJyTG92U6+xlnF/SdxU+ZftZhVvPAXMZRwTQTH/r3haGbiD6Fj4tGuXx9X4pXA5kOFy5h7tIN4vYY/wr0Sdl6NNNpUSUUT26VcBi/S/fGlnglHK/PcFrUU8VzQ4btUNhUVha9UiU4Ie+OVlSe0xk2DXwhpbbrOilvkmrnMdVXpjK6qdEPSyd+Q00bO2OQg/JuMy/WJPR26D9Xl1CBA2E4pvNSFve+hzvoNaQZmsfruYQK7JSWckL1NNe5IQ9Je2hOFzO0EBvxnfTvRjVrqDJ68Khmgi9jUHN2vpWxhzqhFy9LcWxeqqlfxTbcrXm0h6K9Da9JkXpeikMvqXHKusEKbJfKm1nV36dmQ2+7isDYCov5kteQaup+KYAuxx9Skp6UkutMW+v/G/4Bp2LfLeVp7BIAAAAASUVORK5CYII=">`

            WindSpeedTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAACJElEQVRYhe3Y32vNcRzH8cfWyiK/GplIa0iG4mLarSsXlKvNPTdyo5TQ5EpyrzRMQ7tQslKixg1/AC6EuxWTXxEm24Tj4n1OfW3nx+b7PeeseNa3b9/zPt/P59X78/683+/Pl/9Uh8Z6CyiwCVfxFjm8wwDW1UtQD77hPc7hKM7jA75iV60FdWAcw1gyxdaCBxjD2lmM2YT5aUS14xIWl7Avwyf0VxinBb14ju8iBN7gItanEViKfrwqY9+Ol/iBm3lxh3ABHzGJ/VmLOpGfsKGIrV148ik2FrEvxXXhuZ4sRQ0o7akhsWNby7zfiLti4yzKQtAqfBFLUYwukU4q0YFfOJhW0AY8wmesSTsYnuFa4aEpYejEtgovL8BW7BX5aw9eZCBqFMuLGW6IoKt0jeIsVmcgpsDj/Pz401PdSuekAhMioWZJG7ZgMONx/5oGsUvHlN+lNaNZJN8cDiQNyeVrxeYaienEPqzEcfSV+vNtMwv0LK5J3BJlaBrJ8rBCBFw1KfRjI6L1+U8qksvXqHKeKkdOdAWZMiR9AE/gHnanEZL01ExqXzmaROfQLTrKPlH5cynGzIx5OC3EHKuzlmkMim2/sN5CknQJb806vqp54h3J32ddaKspqi1/f13FOaZxBjvL2C+LliSTA8FMGRYHhx1Tfm/AYRFPvbUURPTUD/ETd3ASp8SBIocr6vSVphlH8ES0I+O4LxLonGDOfLv6d/gNsy6Za8uwIiIAAAAASUVORK5CYII=">`
        }

        for (let cruise of cruiseInfo) {

            let dataTimeArrive = new Date(cruise.Arrival)
                .toLocaleString('ru', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })
                .replace(',', '')
            let dataTimDeparture = new Date(cruise.Departure)
                .toLocaleString('ru', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })
                .replace(',', '')

            let imgDeparture = cruise.FlagDeparture;
            let imgArrival = cruise.FlagArrival;
            imgDeparture.replace(re, '');
            imgArrival.replace(re, '');


            PortDepartureImgHtml = `<img class="PortFlagIMG" src="data:image/png;base64,${imgDeparture}">`
            PortArrivalHtml = `${cruise.PortArrival}`
            PortArrivalImgHtml = `<img class="PortFlagIMG" src="data:image/png;base64,${imgArrival}">`
            PortDepartureHtml = `${cruise.PortDeparture}`

            spanArrivalHtml = `<span class="anotherTxt StartWayTxtBlock">??????????????????????</span><span class="TxtWayBlock">${dataTimDeparture}</span>`
            spanDepartureHtml = `<span class="anotherTxt StartWayTxtBlock">????????????????</span><span class="TxtWayBlock">${dataTimeArrive}</span>`

            distanceHtml = `<hr style="width: calc(100%*${cruise.Ratio})!important" class="LineDistance">`

            PassedHtml = `<span class="TxtRouteBlock">${cruise.Passed} ??. ????????</span><span class="TxtRouteBlock">${cruise.PassedTime}</span>`
            StayHtml = `<span class="TxtRouteBlock">${cruise.Stay} ??. ????????</span><span class="TxtRouteBlock">${cruise.StayTime}</span>`
            for (let point of cruise.Route) {
                pointList.push([point.LAT, point.LON])
            }
        }

        let PortLeaf = L.Icon.extend({
            options: {
                iconSize: [15, 16],
                iconAnchor: [15 / 2, 16 / 2]
            }
        });


        let imgPort = new PortLeaf({
            iconUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAABQNJREFUOE9tlXlQ1HUUwD/f329/u7ALiyDoCh6oeGUhqTP+4ZF2awJ5gmkRklNhTjmWeUXjOKWGTmlZ2aHZZYqmCGlZuJXZjBVhpWnisYCI4C7uwd7HtxEn7Xp/vHnzZt5n3j/v8wT/E9+dbpFH685gPVLLT8frsV+xg4zQO91C/179mTNzOjnZvRiWJsS/x//RqP2jVR44VEPVV1bqG9txOoMInZ6o0wkiQPesLPzeGAGvl3RLEo/PLaRg8jgyU4zXOdeL2lNt8pM9n/FR5V4unm2C+GRQDOD20PvWobRevkCwpRX0XVCNiUQdbfTJ7se8gonk3TWO7KyMTlZn+vV0s3x/1xe8t/sz7DYbpHXDkJBG2BvgngmjmTFlEn6/nd2f7sNqPYYxtTtevxcCbrp30XiiuICH58xq6JWsy+wErtywTW7cuhdHqxvMRtDiISYgHOXIoQrOnz6D2aTQ4QuyZOUGGn+3QYYFwkGwNzJi5E2Uzium5P7RQnx/slUuX7kW61e1iDQLItFIzOeDGBiNRuq+2ULVrhpSUox0t/TkqaXl1J9qIHHQQDwtF9FEiKjLwV13j6d8TRli9baD8rW3P6TZ5kBN7UY02AGRMEIfh4Zk2YISpuTegSDAzt1VvPDSu0hpQFi6IZ0uVJOR6OVWEiypvLxmFWLGsrdkxfY9EFTRp/cg5HGAEkWnaES9HnQyzG+1NdTV/kxJ6VP4OlRSBwzGbmuCpEQIRlETTUTdLuaWPIToctuj0nmxDdVgRtEg7LqEIISq6DHoVPpmWFi3dhVNzTZeLH+FpmY3GExEQiFQVDAkQmcN/W8ahGBogdQnmAm1e6C9jbQBacRrkqYzjVgsFjasX8udEwYSisH2iq95e8suTp46hzEpnrCqEAoIUOMg5EefnIQQ2bOljETA5WNwziDKFj+G393Oqxtfx2wyUVT0IDnDc1A1her9X/LB9kq6dk1j+sw8zF1TeWTBUoRmRPo6EJqKyMxbLG3H/4BIlPG3j6Z89bNYkgXz55exb9uH9Mm+hbc2b8Ljc1H0aCne+os8Xb6O0gX5uH0w9t5H6PD4IRqkX1ZfxP2L35TV1QdBqiSY4sibOIb5jxVT+8MxylY8z5W2Sxz+9iANTed4YPbDZPS7mVc3biIhOYHNW7dx6LufaD9rQ0s2UzS7APFa1c/yyYVLiPokhpRkotJHSdEspk7OQ4+ges8Opk/LxeFo5vSZBrIGDkcaEtizv5oPPq5AETrCzRfIzBnKqrLliN/bpSycU8qvR0+iz0gnZG8Bk0bu5DwK8ycx4ua+pHeFQBCuuDs4We/gjfd38kXNN+D3g06g16tMzb2X55YuvHbLa7dUy83v7eTcuSaULkkgVGKeAPpEI90SNR4szMfjusSBg1YamtxEpIqIi0dRJcLvJGdgP2YVTGXR3PxrPmvxROTWj3awftM7OOx+DGm9icQMRIMhlHiVWNgLMoZQdZjizYSCfkKuNoxGQaoWZtWKZygqyL9hm6vQE7ZGWVF5gMrPj1JXdx6CGiKjJzLqhTitEyadbmh3Q8iDkmJg2JCeLJpXyOxpuYoQQl7X11/WPW93SeuRE+za9zWHj53FGwgTi/joNIVO69zSFG8is0cqtw7JYFTOAIpn3keCdsPc/1H4Vfgvl6Q8/KON2uMn2G+14nA6UBSFvj3SGTNyBGNHDWfYkAz6p6sRsxDa39/An0QtGTGwQdHEAAAAAElFTkSuQmCC`
        })

        for (let port of cruiseInfo[0].Ports) {
            let markerOptions = {
                title: [port.PORT],
                icon: imgPort,
            }
            portMarker = L.marker([port.LAT, port.LON], markerOptions).addTo(map)
            portMarker.on('click', function () {
                openInfoPorts(port.CODE)
            })
        }

        SpeedIMG.innerHTML = SpeedTabHtml;
        Speed.innerHTML = mSpeedHtml;
        TempIMG.innerHTML = TemperatureTabHtml;
        Temp.innerHTML = mTempHtml;
        WaveIMG.innerHTML = WaveTabHtml;
        Wave.innerHTML = mWaveHtml;

        CourseIMG.innerHTML = CourseTabHtml;
        Course.innerHTML = mCourseHtml;
        TempWater.innerHTML = TempWaterHtml;
        TempWaterIMG.innerHTML = TempWaterIMGHtml;
        WindSpeedIMG.innerHTML = WindSpeedTabHtml;
        WindSpeed.innerHTML = mWindSpeedHtml;

        PortArrivalIMG.innerHTML = PortArrivalImgHtml;
        PortArrival.innerHTML = PortArrivalHtml;
        PortDepartureIMG.innerHTML = PortDepartureImgHtml;
        PortDeparture.innerHTML = PortDepartureHtml;

        spanArrival.innerHTML = spanArrivalHtml;
        spanDeparture.innerHTML = spanDepartureHtml;

        distance.innerHTML = distanceHtml;

        Passed.innerHTML = PassedHtml;
        Stay.innerHTML = StayHtml;

        allRoute = new L.polyline(pointList, {
            color: 'red',
            weight: '2.5',
            dashArray: '10, 10',
            dashOffset: '0',
            smoothFactor: 1
        })
            .addTo(map);

        ofcruiseInfo.push(...cruiseInfo)
        ofcardData.push(...cardData)
        ofopenCardData.push(...openCardData)
        ofpersonData.push(...personData)

        localStorage.setItem('ofcruiseInfo', JSON.stringify(ofcruiseInfo));
        localStorage.setItem('ofcardData', JSON.stringify(ofcardData));
        localStorage.setItem('ofopenCardData', JSON.stringify(ofopenCardData));
        localStorage.setItem('ofpersonData', JSON.stringify(ofpersonData));
    } else {

        if (allRoute) {
            map.removeLayer(allRoute)
        }

        let ofpersonData = JSON.parse(localStorage.getItem('ofpersonData'));
        let ofopenCardData = JSON.parse(localStorage.getItem('ofopenCardData'));
        let ofcardData = JSON.parse(localStorage.getItem('ofcardData'));
        let ofcruiseInfo = JSON.parse(localStorage.getItem('ofcruiseInfo'));

        let person = ofpersonData[0]

        const SpeedIMG = document.getElementById('SpeedIMG');
        const Speed = document.getElementById('Speed');
        const TempIMG = document.getElementById('TempIMG');
        const Temp = document.getElementById('Temp');
        const Wave = document.getElementById('Wave');
        const WaveIMG = document.getElementById('WaveIMG');

        const Course = document.getElementById('Course');
        const CourseIMG = document.getElementById('CourseIMG');
        const TempWater = document.getElementById('TempWater');
        const TempWaterIMG = document.getElementById('TempWaterIMG');
        const WindSpeed = document.getElementById('WindSpeed');
        const WindSpeedIMG = document.getElementById('WindSpeedIMG');

        const PortDeparture = document.getElementById('PortDeparture');
        const PortDepartureIMG = document.getElementById('PortDepartureIMG');
        const PortArrival = document.getElementById('PortArrival');
        const PortArrivalIMG = document.getElementById('PortArrivalIMG');

        const spanArrival = document.getElementById('spanArrival');
        const spanDeparture = document.getElementById('spanDeparture');

        const distance = document.getElementById('distance');

        const Stay = document.getElementById('Stay');
        const Passed = document.getElementById('Passed');

        let re = /\r\n/gi;

        let SpeedTabHtml = '';
        let WaveTabHtml = '';
        let TemperatureTabHtml = '';
        let CourseTabHtml = '';
        let WindSpeedTabHtml = '';
        let mWaveHtml = '';
        let mTempHtml = '';
        let mSpeedHtml = '';
        let mCourseHtml = '';
        let mWindSpeedHtml = '';
        let TempWaterIMGHtml = '';
        let TempWaterHtml = '';
        let PortArrivalHtml = '';
        let PortArrivalImgHtml = '';
        let PortDepartureHtml = '';
        let PortDepartureImgHtml = '';
        let spanArrivalHtml = '';
        let spanDepartureHtml = '';
        let distanceHtml = '';
        let RouteHtml = '';
        let StayHtml = '';
        let PassedHtml = '';
        for (let card of ofcardData) {

            if (card.Wave !== null) {
                mWaveHtml = `<span class="anotherTxt">???????????? ??????????</span><span>${card.Wave} ??</span>`
            } else {
                mWaveHtml = `N/A`
            }
            if (card.Temp !== null) {
                mTempHtml = `<span class="anotherTxt">??????????????????????</span><span>${card.Temp} ??C</span>`
            } else {
                mTempHtml = `N/A`
            }
            if (card.Temp !== null) {
                TempWaterHtml = `<span class="anotherTxt">?????????????????????? ????????</span><span>${card.TempWater} ??C</span>`
            } else {
                TempWaterHtml = `N/A`
            }
            if (card.Speed !== null) {
                mSpeedHtml = `<span class="anotherTxt">????????????????</span><span>${card.Speed} ????</span>`
            } else {
                mSpeedHtml = `N/A`
            }
            if (card.WindSpeed !== null) {
                mWindSpeedHtml = `<span class="anotherTxt">???????????????? ??????????</span><span>${card.WindSpeed} ??/??</span>`
            } else {
                mWindSpeedHtml = `N/A`
            }
            if (card.Course !== null) {
                mCourseHtml = `<span class="anotherTxt">????????</span><span>${card.Course}</span>`
            } else {
                mCourseHtml = `N/A`
            }

            /* TemperatureTab */
            if (card.Temp <= 0) {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAN5SURBVFhH7Zi5SyxBEIdrN1BE1+etK4iwa+KZiEciBmbmmpqZairmJuKBiImIB4iBsQhiIt6o/4B4gqCo4AHueqD1qmprfLu6O9PjU1h474Oiuqumen4709M9sx4kIMnwqk8qklLUl27f4+Mj7OzswMXFhUY+U1RUBPX19ZCamqoRF7AoN1xeXmJ5eTn/EEerqKjAq6srrTTHtaienp64AhJZb2+vVprjek4dHByIp6sFu7u7CY3zzP7+vnhXqDhj2tra5ArU1tZqJD6c5+MCgQB2dnbizMyMZpz5cVHRZjq/vmVJOD8/h6OjI/EfSU9PB7pa0NHRAbm5uRq151tEFRf7IRgMiP9Ia2srHB4ewtTUFHg8Ho3a82+u6Jubm9De3g4jIyMacebHRZ2dncH8/Dx0dXUBTXSN2vPjorKzs4GeROju7oa8vDyN2uNaFD2x2jKjpaVFFtOhoaGfmegrKyuwuLioPTMWFhZgeXlZe4ZElitntra2MC0tTRbBgoICXF9f1wxfuj9mwXk+jo/nuu3tbc04YyQqHA6/vxn4/X6kdUcziHd3dzGi7u/vNYNI+yTSK4zU8RsDvfJoxh4jUYODgzIwzQmk26fRP0LimQXdPqnj+uHhYY3aE1WemKqqKhm0ublZI59FxDOLpqYm6gPW1NRoxJ6o0vjQniYDsk1MTEjs9vb2/cR2Zt3K8fFx6kfGODk5kZgdjk8fDaItALpi4rOyfol3IjPTJ96qY46Pj7WVGEdR9PqrLYD8/HxtuaOwsFBbseMlwlFU9Cp8fX2tLXdEby8mq7qjqGAwqC0AWmvEPzyExDsRCoXF0xonnikrK9OWDTq3bKmsrJRJ2tDQoJH4E/ujMW9vb1hXV0d9wOrq6kjQAS21p7+/XwZlm5ub0+hnEdFmMTs7S/1I7cDAgEbtiSpPTCgUwpKSEhnY5/Ph3t6eZhCfn5/fhbC9vLxoBpE2YszIyJC60tJS2RlMMBLF0GaMKSkpcgI+0fT0NL6+vmo2Fo5PTk4ivZ/L8Vy3tramWWeMRTF8KyxhbDxH+vr6cGlpSa4Ke+5bOwAbfbbH3HITXIliVldX5VvOOqmd0ZOGGxsbWmmOa1HM09MTjo6OytPo9XpjhHC/sbERx8bGZL59hb/+04wX1NPTU7i5uYGcnBygCW38fZeI///kmZKEogB+AzAU/LyQVthtAAAAAElFTkSuQmCC">`
            } else if (card.Temp > 0) {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAOPSURBVFhH7ZhNLCRREMdr5mB2fCTrm2QHwR6M4bA2w2kcHDZx54iTK1dxd0REXH2EkDiLRByI7+BAXHbWZ1ZCsCtIfGZS+6q2Wow1/V5bEsnuL3mp6qp+3f95/bre63GhAt4YbrFvijcp6lmP7/r6GpaXl+Hw8FAif5KVlQXBYBA8Ho9EHECinHB0dIRFRUX0Q7TN7/fj8fGx9DTHsaiWlpYnBcRqra2t0tMcx3Nqc3OTrRotWFlZidkoT4TDYbaOEHHG1NTU8AiUlZVJ5GkoT+fl5+djY2MjDgwMSEbPq4t62Ezn14uUhIODA9je3mb7mISEBFCjBfX19ZCamipRe15ElCcYgveVX9g+prq6Gra2tqCvrw9cLpdE7fk3K/rCwgLU1tZCV1eXRPS8uqj9/X0YHR2FpqYmUBNdova8uqjk5GRQbyI0NzdDWlqaRO1xLEq9seKZUVVVxcW0o6PjdSb69PQ0jI+Py5EZY2NjMDk5KUeG/C5XehYXF9Hr9XIRzMjIwLm5Ockg/vhQeN8sKE/n0fnUb2lpSTJ6jERdXV3d7wyys7NR1R3JIJ6dnUWJOj8/lwyiWidRbWG4H+0Y1JZHMvYYiWpvb+cLqzmB6vFJNHqEHjcL9fi4H/Xv7OyUqD1Gm7ySkhLY2NiAyspKmJqa4thP30e2dqR8/8Y2FArBzMwMlJaWwtraGsfs0E70nZ0dFkTU1dWxVY+MrY6Liwu2Vr/19XXY29tj3w6tqN3dXfEAAoEA20jgM1sdd/5PbK1+BP1IHVpRavsrHkB6erp4zsjMzBQv+nqx0Ip6WIVPTk7Ec8bD5cWkqmtFFRQUiAegag3bd1/1k5XwhtfZqhrHligsLBQvNlpReXl5UFxczP7g4CDb+Ph4tjpU0eRlyepHb3FOTg77dmhFEQ0NDWxppEZGRti3XvdYWPnh4WH+RiSs62ihOqXj8vISfT4fF8CkpCRcXV2VDOLt7W1U0by7u5MMolqIMTExkfvl5ubyymCC8dqnFmOMi4vjG9CN+vv7MRKJSDYaivf29qLan/P51G92dlayeoxFEUNDQ/fCqKk5gm1tbTgxMcGjQpaOVV26P0d9tqN6hHIFMxyJItRywd9y1k3tmnrTcH5+Xnqa41gUcXNzg93d3VheXo5utztKCB1XVFRgT08Pz7fn8Nd/mlFBpfXs9PQUUlJSQE1o4++7WPz/J8+UNygK4Bflp3G4eU+s+QAAAABJRU5ErkJggg==">`
            } else {
                TemperatureTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAMqSURBVFhH7Zi7S2tBEIcnKRSJKXxrEQJq47MRH41Y2Nlrmy6ttmJvIz4QsZHgAySFtQhiI75R/wHxFbAQFQQLTRQdZ9YxREz2zN5LIHDvB8vOmT2z55c9u7N74kMCCgy/1AVFQYr6o9eXTCbh+PgYbm9vxfOb2tpa6OrqguLiYvE4wKJcuLu7w6amJv4hnqW5uRnv7+8lUo+zqNHR0awCcpWxsTGJ1OM8p87Pz01NowUnJyc5C7czZ2dnpnZCxKkZHBw0I9DR0SGe7HA731dfX4/RaBRXVlakxZu8i8os2vmV95QQCASARgsikQhUVFSI107eRQ0MDMDFxQUsLS2Bz+cTr51/M6MfHBzA0NAQzM7OisebvIu6ubmBtbU1GB4eBpro4rWTd1FlZWVAKxFGRkagsrJSvHacRdGKFUtHf3+/SabT09P5mejb29uwsbEhVzrW19dha2tLrpR8pStvDg8PsaSkxCTB6upq3Nvbk5bscDvfx/dz3NHRkbR4oxL18vKSPhnU1dUh5R1psUP7JNIRxsTxiYGOPNJiRyVqamrKdExzAun1iVcHvT4Tx/EzMzPitaMS1draajrt6+sTjxu9vb0mvr29XTx2PEVdXl6aDrnEYjHx6nh6ejL1wsJCuo/r62vjs+G5+qgTsQBoxMTSEQwGTZ0Zd3V1JVZuPEXR8VcsgKqqKrHcqKmpEetnf7nwFJWZhR8eHsRyI3N70WR1T1ENDQ1iAVCuEcsNynFiATQ2NoplQeaWlZaWFjNJu7u7xaPn4+MDOzs7TXxbW5t47ahETUxMpFdPPB4Xr47V1dV07OTkpHjtqEQ9Pz9jKBQyHdOKwtPTU2lBfH19FeuLt7c3sRBpI8bS0lITFw6Hzc6gQSWKoc0Yi4qKzAP4QcvLy/j+/i6tP2H/4uIi0vnc3M9xu7u70uqNWhTDr+JbGBeeI+Pj47i5uWlGhWu+/t4BuNBnu/MrdxLF7OzsmG+574faCq003N/fl0g9zqKYVCqFc3NzZjX6/f4fQvi6p6cH5+fnf803LX/9pxkn1EQiAY+Pj1BeXg40odXfd7n4/0+elgIUBfAJFX9R6wJOQlwAAAAASUVORK5CYII=">`
            }

            if (card.Temp <= 0) {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAN5SURBVFhH7Zi5SyxBEIdrN1BE1+etK4iwa+KZiEciBmbmmpqZairmJuKBiImIB4iBsQhiIt6o/4B4gqCo4AHueqD1qmprfLu6O9PjU1h474Oiuqumen4709M9sx4kIMnwqk8qklLUl27f4+Mj7OzswMXFhUY+U1RUBPX19ZCamqoRF7AoN1xeXmJ5eTn/EEerqKjAq6srrTTHtaienp64AhJZb2+vVprjek4dHByIp6sFu7u7CY3zzP7+vnhXqDhj2tra5ArU1tZqJD6c5+MCgQB2dnbizMyMZpz5cVHRZjq/vmVJOD8/h6OjI/EfSU9PB7pa0NHRAbm5uRq151tEFRf7IRgMiP9Ia2srHB4ewtTUFHg8Ho3a82+u6Jubm9De3g4jIyMacebHRZ2dncH8/Dx0dXUBTXSN2vPjorKzs4GeROju7oa8vDyN2uNaFD2x2jKjpaVFFtOhoaGfmegrKyuwuLioPTMWFhZgeXlZe4ZElitntra2MC0tTRbBgoICXF9f1wxfuj9mwXk+jo/nuu3tbc04YyQqHA6/vxn4/X6kdUcziHd3dzGi7u/vNYNI+yTSK4zU8RsDvfJoxh4jUYODgzIwzQmk26fRP0LimQXdPqnj+uHhYY3aE1WemKqqKhm0ublZI59FxDOLpqYm6gPW1NRoxJ6o0vjQniYDsk1MTEjs9vb2/cR2Zt3K8fFx6kfGODk5kZgdjk8fDaItALpi4rOyfol3IjPTJ96qY46Pj7WVGEdR9PqrLYD8/HxtuaOwsFBbseMlwlFU9Cp8fX2tLXdEby8mq7qjqGAwqC0AWmvEPzyExDsRCoXF0xonnikrK9OWDTq3bKmsrJRJ2tDQoJH4E/ujMW9vb1hXV0d9wOrq6kjQAS21p7+/XwZlm5ub0+hnEdFmMTs7S/1I7cDAgEbtiSpPTCgUwpKSEhnY5/Ph3t6eZhCfn5/fhbC9vLxoBpE2YszIyJC60tJS2RlMMBLF0GaMKSkpcgI+0fT0NL6+vmo2Fo5PTk4ivZ/L8Vy3tramWWeMRTF8KyxhbDxH+vr6cGlpSa4Ke+5bOwAbfbbH3HITXIliVldX5VvOOqmd0ZOGGxsbWmmOa1HM09MTjo6OytPo9XpjhHC/sbERx8bGZL59hb/+04wX1NPTU7i5uYGcnBygCW38fZeI///kmZKEogB+AzAU/LyQVthtAAAAAElFTkSuQmCC">`
            } else if (card.Temp > 0) {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAOPSURBVFhH7ZhNLCRREMdr5mB2fCTrm2QHwR6M4bA2w2kcHDZx54iTK1dxd0REXH2EkDiLRByI7+BAXHbWZ1ZCsCtIfGZS+6q2Wow1/V5bEsnuL3mp6qp+3f95/bre63GhAt4YbrFvijcp6lmP7/r6GpaXl+Hw8FAif5KVlQXBYBA8Ho9EHECinHB0dIRFRUX0Q7TN7/fj8fGx9DTHsaiWlpYnBcRqra2t0tMcx3Nqc3OTrRotWFlZidkoT4TDYbaOEHHG1NTU8AiUlZVJ5GkoT+fl5+djY2MjDgwMSEbPq4t62Ezn14uUhIODA9je3mb7mISEBFCjBfX19ZCamipRe15ElCcYgveVX9g+prq6Gra2tqCvrw9cLpdE7fk3K/rCwgLU1tZCV1eXRPS8uqj9/X0YHR2FpqYmUBNdova8uqjk5GRQbyI0NzdDWlqaRO1xLEq9seKZUVVVxcW0o6PjdSb69PQ0jI+Py5EZY2NjMDk5KUeG/C5XehYXF9Hr9XIRzMjIwLm5Ockg/vhQeN8sKE/n0fnUb2lpSTJ6jERdXV3d7wyys7NR1R3JIJ6dnUWJOj8/lwyiWidRbWG4H+0Y1JZHMvYYiWpvb+cLqzmB6vFJNHqEHjcL9fi4H/Xv7OyUqD1Gm7ySkhLY2NiAyspKmJqa4thP30e2dqR8/8Y2FArBzMwMlJaWwtraGsfs0E70nZ0dFkTU1dWxVY+MrY6Liwu2Vr/19XXY29tj3w6tqN3dXfEAAoEA20jgM1sdd/5PbK1+BP1IHVpRavsrHkB6erp4zsjMzBQv+nqx0Ip6WIVPTk7Ec8bD5cWkqmtFFRQUiAegag3bd1/1k5XwhtfZqhrHligsLBQvNlpReXl5UFxczP7g4CDb+Ph4tjpU0eRlyepHb3FOTg77dmhFEQ0NDWxppEZGRti3XvdYWPnh4WH+RiSs62ihOqXj8vISfT4fF8CkpCRcXV2VDOLt7W1U0by7u5MMolqIMTExkfvl5ubyymCC8dqnFmOMi4vjG9CN+vv7MRKJSDYaivf29qLan/P51G92dlayeoxFEUNDQ/fCqKk5gm1tbTgxMcGjQpaOVV26P0d9tqN6hHIFMxyJItRywd9y1k3tmnrTcH5+Xnqa41gUcXNzg93d3VheXo5utztKCB1XVFRgT08Pz7fn8Nd/mlFBpfXs9PQUUlJSQE1o4++7WPz/J8+UNygK4Bflp3G4eU+s+QAAAABJRU5ErkJggg==">`
            } else {
                TempWaterIMGHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAMqSURBVFhH7Zi7S2tBEIcnKRSJKXxrEQJq47MRH41Y2Nlrmy6ttmJvIz4QsZHgAySFtQhiI75R/wHxFbAQFQQLTRQdZ9YxREz2zN5LIHDvB8vOmT2z55c9u7N74kMCCgy/1AVFQYr6o9eXTCbh+PgYbm9vxfOb2tpa6OrqguLiYvE4wKJcuLu7w6amJv4hnqW5uRnv7+8lUo+zqNHR0awCcpWxsTGJ1OM8p87Pz01NowUnJyc5C7czZ2dnpnZCxKkZHBw0I9DR0SGe7HA731dfX4/RaBRXVlakxZu8i8os2vmV95QQCASARgsikQhUVFSI107eRQ0MDMDFxQUsLS2Bz+cTr51/M6MfHBzA0NAQzM7OisebvIu6ubmBtbU1GB4eBpro4rWTd1FlZWVAKxFGRkagsrJSvHacRdGKFUtHf3+/SabT09P5mejb29uwsbEhVzrW19dha2tLrpR8pStvDg8PsaSkxCTB6upq3Nvbk5bscDvfx/dz3NHRkbR4oxL18vKSPhnU1dUh5R1psUP7JNIRxsTxiYGOPNJiRyVqamrKdExzAun1iVcHvT4Tx/EzMzPitaMS1draajrt6+sTjxu9vb0mvr29XTx2PEVdXl6aDrnEYjHx6nh6ejL1wsJCuo/r62vjs+G5+qgTsQBoxMTSEQwGTZ0Zd3V1JVZuPEXR8VcsgKqqKrHcqKmpEetnf7nwFJWZhR8eHsRyI3N70WR1T1ENDQ1iAVCuEcsNynFiATQ2NoplQeaWlZaWFjNJu7u7xaPn4+MDOzs7TXxbW5t47ahETUxMpFdPPB4Xr47V1dV07OTkpHjtqEQ9Pz9jKBQyHdOKwtPTU2lBfH19FeuLt7c3sRBpI8bS0lITFw6Hzc6gQSWKoc0Yi4qKzAP4QcvLy/j+/i6tP2H/4uIi0vnc3M9xu7u70uqNWhTDr+JbGBeeI+Pj47i5uWlGhWu+/t4BuNBnu/MrdxLF7OzsmG+574faCq003N/fl0g9zqKYVCqFc3NzZjX6/f4fQvi6p6cH5+fnf803LX/9pxkn1EQiAY+Pj1BeXg40odXfd7n4/0+elgIUBfAJFX9R6wJOQlwAAAAASUVORK5CYII=">`
            }

            /* WaveTab */
            if (card.Wave === 0) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAlhJREFUWEftmCFzAkEMhbedwYDBgACDwYDBYMBg+L8YfgIYDAYEGAwIMBgwiLZfSjo7ud3jrjXHlGeuk/CSbJJ3e9O3jy+4guH9/iwUCllUdHy3280tFgt3PB7daDRy1Wr17nFuv9+Lr9lsul6v50qlktjhLJdL8Q+HQ1er1cQOTqeTm81mCU4IiaIIeDgcJMjlcrlbnSSo1+tSJD5FpVL5SZ6X02g0pEiLRFGTyURODFqtlpBXq5W7Xq9iA+Vy2XW7XUm02+3u1m/k4dD98Xgsf/tIFHU+n6UoCP5YsNMFvzMAGz4AB79CO2c5Go9C/d8rnu+VwIn8HfGh3bHQLoSAHf8jRDtFABTGs9/vy64o2Jf1ei3jQpk6Zg4wn8+Fg8La7bbYwXa7FWXCGQwGwbEpEkWREPXZ0xKEHQidln0JdSiNQ3Ec1C9ckShqOp2KalQtBKZQX9IE63Q6oiI6oAnpGB0iIV3xORROxznwZrORHPwuk/pi0E74KlJgpyA7kjROGv6P+vJyLKKdUiXxZE989flKiqnPKvbP6mNB/SUFqiQW1HZCdyYvh3svk/r07ktTHwHpHpe3VR9JSBZSn+Vgo9MWiaL4sY7DB3bGQvutX3cFn480TiwPeE71xRSDHb/FbzgWD9VHoKz3WFYOyrSj9pEoCjLXhz0t8ydQ6LSaIC/n13cfZKskPmPpROjuIwnJ+MIIqY8CUTM5MqsvDSQhkIW+g0IvxBgnDc+pPvsmVtj9UcCJ+UK7FUK0UwR4fXl6eKg+Atu7j2CvL88ioJD/dXkVlQ3OfQKagd1rxtVE5QAAAABJRU5ErkJggg==">`
            } else if (card.Wave > 0 && card.Wave <= 1) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKPSURBVFhH7ZWxjhNBDIapeAN4Ah4B3gCegIIaKOmhPiQqoAFEAw2CKldEQglFmgBKClKBlDRpckUKlCYUkZDSzOmbHUdez3jZpDgOcb802h3P/Pbvta29FM4hLkS1hStqu92G8Xgcut1uWK/XyVphuVxG+2QyifcEvGPjbLVaJWsF9iVOCZkoAkLs9/uh0+ns1nA4DLPZLD61nXvcP4RDrBIyUWQjZIiLxSL0er2aU/bYOdd21j6cwWCQotaRiaJUfGpbFmw4tWXZbDYxYxbvGh5H/Nn7gn+r0QEZednY5hfA8c6w6wp4cEXhgJpTe0qgMZ1Odz2hg5CAcObzebJWYC8cL1FBJoqA4lgvJoYp0oMgC/u+HO5b4YJMlEyNTAsNaUeaCSJbEtABeYfDV7Yc9nAQIjEQVkLrRpeJKQERpZI0cZrQWtRZolEUmXpN6U3YIRwLVxSOqbn0iYaeJG/6mjieaEEmiua1TcqSSbL/Nxb2Qzitp0+mqWn62FOK0vRh86bPcrCVkInS5dCQSSqdE6zUL00cLw5obPS/hUZRZFP6AgC79wX25Vi4ovQk2Yb0JqktxxMtyERBFsd60Zw0pm5sWdw/hGOFCzJR9t9HVnaSRqNR/Cre9HFmOezxhU+Jga2EvRrd+48hQpdR4//49603v8PJ6lfa1fF98TO91QHHO8PO+Z/gisLBjUdvw+U7T8K7zz+StcLj46/RzrkWrTkvP02StYLHKSETBVkc63X13vNw6+hDfNoz7h/CedH/lqLWkYm69uBVJPHkC32ZnYSbR+9rDu+//hizJYErd5/t7MLhi1nO7afHkcO5xLj+8E2KWkfrRqcXEFgCwbySeJwmtBZ1lrgQ1RbnUFQIpwcTzGG6g5S/AAAAAElFTkSuQmCC">`
            } else if (card.Wave > 1 && card.Wave <= 2) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuRJREFUWEftlT9sUlEUxo8mGANDGYQmkFgWHCC1DOIAsbKwmLhpnBoXR91MnLrYODg4GTcXu9aBxODiIm1gEAcw4Q0w+GgCUTAREkENA/Y73KuX+/4U4kJTfsuDc95377nn3A/OjI+gBeOseC4UC1mU4/hGoxGVy2XqdDqUyWTI7/eLDFGr1eJcOBymRCJBHo+H49BUKhXOp9NpCgQCHAfdbpeKxaJFY4elKCzYbrd5kcFgIKLEGwSDQS4SOYnP5/u7+byaUCjERepYisrlcnxiEIlEWFyr1Wg4HHIMeL1eisfjvJFpmiI6YR4Nup/NZvmziqWoXq/HRUGgjgVxdEHtDEAMOQAN8hLZOV0j10Oh6vuSk/eTgBOpd0RFdkdHdsEOxJE/DsdOYQE4DM9kMsl3RYL7YhgGjwvOlGPGAUqlEmvgsGg0ynHQaDTYmdCkUinbsUksRWFDuE8/LRbBHbA7Le6LXYfcNCgOB1ULl1iKyufz7BrpFiyMQlVLY7FYLMYuQgfkhugYOoQN0RVVg8LRcRy4Xq/zHnhvJvc5ITuhukiCOArSR+KmceP0uG9ejY5jp6ST8MQ9Ud2nOsnJfbpj/9t9uKDqJQXSSbigeifknZlXg/+9mdwn//vc3IcF0T38eevuwybYzM59ugYxdFrHUhReluNQQRxjQfv1vLwryKm4aZz2ASfPfb3BL2p2++LbNFXzq/g0DTROOcSRPxZ0yo7K5y/j5KOX43N3noxfva+K6ITHe/scR97s9ER0WvP87QcRneCkscMyvp3XB/TmY91yWr/vPG2srVK1aT3tRmSVn/NqtjbX6cGNqyLyD0tR0fsv6PBbny5eWKHt29coEljhQveNQ/EG0db1ddq+tUm7hU901BHqD39zXGpQyMPdd1Oam1cu0bO7WSoYTdrZO+A9Lq8Fqfz0nnhDAUXNwvcfP8eFmim+TYNxOI3ESePG0n1L9y3dp7J0n3guFMuiZoPoD6eWky87VqyeAAAAAElFTkSuQmCC">`
            } else if (card.Wave > 2 && card.Wave <= 3) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAApZJREFUWEftmDFsUlEUho8mGANDGYQmkLQsOEBqGcQBYmVhMXHTODUujrqZOHWxcXBwMm4udq0DicHFRdrAUBzAhDfA4KMJRMHERyKoYXj2P9yr9/Heo5A40OR9y4Nz3n/vf869h4Fz5gm0ZJwXz6ViKU25Ht94PKZqtUq9Xo9yuRwFg0GRIep0OpyLRqOUSqXI5/NxHJparcb5bDZLoVCI46Df71O5XLZpnLCZwoLdbpcXGQ6HIkq8QTgcZpPISQKBwN/NF9VEIhE2OY3NVKFQ4IpBLBZjcaPRoNFoxDHg9/spmUzyRrqui+iERTTofj6f588qNlOGYbApCNRjQRxdUDsDEEMOQIO8RHZuWiPXg1H1fcnZ+0lAReodUZHdmUZ2wQnEkT8N105hAUwYnul0mu+KBPdF0zQ+LkymPGYUUKlUWIMJi8fjHAetVosnE5pMJuN4bBKbKWyI6ZuuFovgDjhVi/vi1KFZGphDoapxic1UsVjkqZHTgoVhVB1pLJZIJHiK0AG5ITqGDmFDdEXVwDg6joKbzSbvgffmmj43ZCfUKZIgDkPTRzJLM4uzN33G8Be1+wPxzUpd/yo+WYHGLYc48qeCTjlR+/zFTD9+ZV64+9R8/aEuohOe7B9wHHm9Z4ioVfPi3ZGITnDTOGE7vt03h/T2Y9NWbTBwkTbXV6netle7GVvl56Ka7a0Nenjzmoj8w2Yq/uAlHX8b0NqlFdq5c51ioRU2eqAdizeItm9s0M7tLdorfaKTjtBg9JvjUgMjj/beWzS3rl6m5/fyVNLatLt/yHtcWQ9T9dl98YYCTM3D9x8/zVJDF9+s4DjcjsRNMwtv+rzp86ZPxZs+8XTEmz4Fb/q86fvfLOW/Lp6p+SD6Ax1dauQOKl7UAAAAAElFTkSuQmCC">`
            } else if (card.Wave > 3 && card.Wave <= 4) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAgBJREFUWEftmDFoGlEYx/8NWIIOOlQFhXpLu0iiQ5JFYlxcAtlaOoUuHdOt0ClLQocOnUq3Ls2aDEIgS5aY4FIzaECHLj0FpT0LOaHaBIer3+e79s7zkgiBXOD9lnf3/+7/3v+9x+fgA2MIPMaMGD2FJ0O5Xt9gMEC5XIamacjlcgiFQqICtFotrsXjcaTTafh8PtbJU6lUuJ7JZBAOh1knOp0OSqWSwzMJRyiasN1u8yS9Xk+o4AUikQiHpJpJIBD4t/i0nlgsxiHHcYQqFAq8Y0JRFDbXajX0+33WCL/fj2QyyQupqirUEdN46PTz+Tw/W3GE0nWdQ5HBei2k0ylYT4YgjWoEeahuYp7cuMecj4Javze5fz8Jeu8CjU5XvNmpqj/Fkx3yuNVIp/q10ElNovL9h7H49rPx8MU748tRVagjtnaPWae6qulCtXs+HnwV6gg3zyQc17e9d4L902+O3YYCs0gloqg2nLtNKVEep/WsZ+fwenVJKP9xhHqy8QnNX108fhTE5vNlKOEgBz2uN8UXwPrKHDafZbFTPMPwRNDtX7JueijIm51Dm2dt4Sk+vMyjWG9ge/eE15hPRFB+/0p8YYFC3YTz33+MYk0Vb3boOtyuxM1zFbL7ZPfJ7rMiu0+ME5HdZ0F2n+y+20Z2n+w+2X13hSf/dZGhbgbwF7U6QrfdVU62AAAAAElFTkSuQmCC">`
            } else if (card.Wave > 5) {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAThJREFUWEdj/A8EDIMMMEHpQQXwOurD1x8MD19/hPJQwcUHL6EsVADSg0sOJA6SJwhA0YcNXLj/4r9p+Zz/bOGt/xceuAgVhYCm1YfA4iD5B68+QEVR9UzedgoqCgG49GADGGmqec1hhs1nbmH4VoCbg0FfXpzh4kNM3+oriINpUvXE2uky5HqZQUUQAMNRqjlTGR69+cggJ8LPUBtqy6Agyg926KFrj6AqGBhi7XUZakPsGBYdvMQADBGGj99+gsVhekAOKVm0G0WPr4kaQ2+8K8PBaw8ZmlcfBtuhJy/GcLozBaoCCYAcRQx4/+X7/4NXH0B5qAAUHbiiBJcefGDoFQmjuQ8JjOa+0dxHbTCa+0Zz32juGygwmvtGc99o7hsoMJr7RnPfaO4bKIA39w0UGHUUcYCBAQBxwB+sWvdkLAAAAABJRU5ErkJggg==">`
            } else {
                WaveTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAlhJREFUWEftmCFzAkEMhbedwYDBgACDwYDBYMBg+L8YfgIYDAYEGAwIMBgwiLZfSjo7ud3jrjXHlGeuk/CSbJJ3e9O3jy+4guH9/iwUCllUdHy3280tFgt3PB7daDRy1Wr17nFuv9+Lr9lsul6v50qlktjhLJdL8Q+HQ1er1cQOTqeTm81mCU4IiaIIeDgcJMjlcrlbnSSo1+tSJD5FpVL5SZ6X02g0pEiLRFGTyURODFqtlpBXq5W7Xq9iA+Vy2XW7XUm02+3u1m/k4dD98Xgsf/tIFHU+n6UoCP5YsNMFvzMAGz4AB79CO2c5Go9C/d8rnu+VwIn8HfGh3bHQLoSAHf8jRDtFABTGs9/vy64o2Jf1ei3jQpk6Zg4wn8+Fg8La7bbYwXa7FWXCGQwGwbEpEkWREPXZ0xKEHQidln0JdSiNQ3Ec1C9ckShqOp2KalQtBKZQX9IE63Q6oiI6oAnpGB0iIV3xORROxznwZrORHPwuk/pi0E74KlJgpyA7kjROGv6P+vJyLKKdUiXxZE989flKiqnPKvbP6mNB/SUFqiQW1HZCdyYvh3svk/r07ktTHwHpHpe3VR9JSBZSn+Vgo9MWiaL4sY7DB3bGQvutX3cFn480TiwPeE71xRSDHb/FbzgWD9VHoKz3WFYOyrSj9pEoCjLXhz0t8ydQ6LSaIC/n13cfZKskPmPpROjuIwnJ+MIIqY8CUTM5MqsvDSQhkIW+g0IvxBgnDc+pPvsmVtj9UcCJ+UK7FUK0UwR4fXl6eKg+Atu7j2CvL88ioJD/dXkVlQ3OfQKagd1rxtVE5QAAAABJRU5ErkJggg==">`
            }

            SpeedTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAADL0lEQVRYhe3Yy4tcVRAG8N+MyYx5OJlEiAM6DoKPwCjiAxKVEVyIaEQQBV0ZxagQF/oHGCGuxE2CCUnAjAtRia7UXRw0WWkWahBRJIEBMeJjoUl0Eds47aKqnTvt7cftdLvKB83l1Kn66ut7Tled01zA/4+L+0U01EPMRbgL9+BWbMA6jKCGX/EtPsMhHMbf/RBbhnXYgZ9Qx+84gj2YTdtsjo/kfD39d2R83zCM53Aa5/AO7hVvpoGZFDBTsI3gPrybcaeTZ/h8BU2Ib10XS3Cghd849uWzDAcyvi6W87JeBW3APE7hEezEX7iiIs9kxu3Eo8k3j+uqCprCD/ge02kbwwtYWZFrZcaN5fh6nEz+K7slWY2v8TOuriigW1yDXzLP6m4C9onXffuABDVwR+bZ28lxBgv4QB9+JR0wnHkWcGc7x8OiANbxCZYPSNByfJp5apm3FLel09N4GPtF9e431ibv/szzTObdWOa8B7/pYw8rYBW2YA6PNc2tEIX11bLAH/FGH4UMiT36Os5k4rtb+L4pSsQSXCVe4ZYekk9iF97DK9gk6tKJ5KyLunRjG44n0m+qaHwojdNlEW2wUVToP3Asn/Wmz1cpvB1uSN8Hi8Zn0zhWFtECQ/hGFMCJtE2krSHoY637YRFj6b+taNwu6sUc3seaLoiuTaLHm+yNpXjL0pNEGdaIWjWX+bezWCAXLB74ajnuhIZPc9lojF9Mrk4ctcw91Jz3KfHt1nYhpoEhfInjFhvrlNjgxyrwwKWZf2vR+EAa2/1CynCTaKw1cQSu5bgXnjruLxon0/hkRTJYj5dwMJ/re+BorNTlzRMn8HYPhP3AQbEN/oPdovJWPcSdL1aJS8busslpsfu3YTNew+iAhIyK9rNZ1MgFbQr3Rzgr1vdz0SwHgRX4IvOcFXWqJW4R16EPsWxAghpYlnnO4ebiRNkNeZdYwkvwZ8E+JW7FveIQviuMR8Ve2ovnOwWPiE7fjMYtuNfPbAnnJiWtqGyJajjaQuzxFoI74WhZ8hZ5Ku+bcXFcropuTgr/ooqoeVGtX64kZ2l8V6j6V9B4DzHEnjrVQ9wFtMU/4EXK79J36HYAAAAASUVORK5CYII=">`

            CourseTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAADX0lEQVRYhdXYz29VVRAH8A/EmtgHNDEgGqMbtepKaglqIhQksQkY9upCV4grNYFoIqiARoyJ+CfoRhPagi7dqLgkRaAmim38VULU+AOCdlGK1sWZy7uW9+6755WFfpObuee8mTnfd37MzLn8B7FkEbbLMIB+rMQKXMCvmMQJ/LlYgnXQh6dxFBcxX/FcDL0dYXfV0cB+nI8Bv8JebMVd2BT9G6O9FftwOvrPh37jahHajOlwPoI1LXSuxRPoafHbAEbD/gc8tFhCL+AvnMSDFXpL8UjIdliPCVzCrm4Jvak5O70ddIdDd7iDXgNjoftGLqHnw/At9U7o7tDfXUN3CQ6Gfu0Z2ywt2UhNQnAkBjlSU3+pNGOXpENSiWXSZjyp85KVcSZIncmwaUh77PtOY+3H36o39UKsDkJfhlydYbshbPa2U+iT4slIhlPYEo6fDbkl034M57QJsDvCaas4VIU9mMP1Ifdk2t8b4z7V6sfPpEidiw9wKt5PRTsXk/i0aBTBbjnux6EuHK7FeLyPRzsXh/CAdNAuk1ojpYhjmc5uxM0lUsejfVOmn2NSqrqnTOrOkN9kOhsM+XmJFGmf5GAqZH+Z1MqQt2qdVNthrbS5y3tqTt4S9uCWeF8F10SjCF4f4Um8W9PhHVJh90yp70L018VjeCfeG2VSMyGH8UmGwyk8jgMt+uviPfwoTcgMzeX7LeS0NP11MZ7Z3wpzmunplzKpr0PeluGsavDjbfrboVju02VSJyTG92U6+xlnF/SdxU+ZftZhVvPAXMZRwTQTH/r3haGbiD6Fj4tGuXx9X4pXA5kOFy5h7tIN4vYY/wr0Sdl6NNNpUSUUT26VcBi/S/fGlnglHK/PcFrUU8VzQ4btUNhUVha9UiU4Ie+OVlSe0xk2DXwhpbbrOilvkmrnMdVXpjK6qdEPSyd+Q00bO2OQg/JuMy/WJPR26D9Xl1CBA2E4pvNSFve+hzvoNaQZmsfruYQK7JSWckL1NNe5IQ9Je2hOFzO0EBvxnfTvRjVrqDJ68Khmgi9jUHN2vpWxhzqhFy9LcWxeqqlfxTbcrXm0h6K9Da9JkXpeikMvqXHKusEKbJfKm1nV36dmQ2+7isDYCov5kteQaup+KYAuxx9Skp6UkutMW+v/G/4Bp2LfLeVp7BIAAAAASUVORK5CYII=">`

            WindSpeedTabHtml = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAABmJLR0QA/wD/AP+gvaeTAAACJElEQVRYhe3Y32vNcRzH8cfWyiK/GplIa0iG4mLarSsXlKvNPTdyo5TQ5EpyrzRMQ7tQslKixg1/AC6EuxWTXxEm24Tj4n1OfW3nx+b7PeeseNa3b9/zPt/P59X78/683+/Pl/9Uh8Z6CyiwCVfxFjm8wwDW1UtQD77hPc7hKM7jA75iV60FdWAcw1gyxdaCBxjD2lmM2YT5aUS14xIWl7Avwyf0VxinBb14ju8iBN7gItanEViKfrwqY9+Ol/iBm3lxh3ABHzGJ/VmLOpGfsKGIrV148ik2FrEvxXXhuZ4sRQ0o7akhsWNby7zfiLti4yzKQtAqfBFLUYwukU4q0YFfOJhW0AY8wmesSTsYnuFa4aEpYejEtgovL8BW7BX5aw9eZCBqFMuLGW6IoKt0jeIsVmcgpsDj/Pz401PdSuekAhMioWZJG7ZgMONx/5oGsUvHlN+lNaNZJN8cDiQNyeVrxeYaienEPqzEcfSV+vNtMwv0LK5J3BJlaBrJ8rBCBFw1KfRjI6L1+U8qksvXqHKeKkdOdAWZMiR9AE/gHnanEZL01ExqXzmaROfQLTrKPlH5cynGzIx5OC3EHKuzlmkMim2/sN5CknQJb806vqp54h3J32ddaKspqi1/f13FOaZxBjvL2C+LliSTA8FMGRYHhx1Tfm/AYRFPvbUURPTUD/ETd3ASp8SBIocr6vSVphlH8ES0I+O4LxLonGDOfLv6d/gNsy6Za8uwIiIAAAAASUVORK5CYII=">`
        }

        for (let cruise of ofcruiseInfo) {
            let dataTimeArrive = new Date(cruise.Arrival)
                .toLocaleString('ru', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })
                .replace(',', '')
            let dataTimDeparture = new Date(cruise.Departure)
                .toLocaleString('ru', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })
                .replace(',', '')

            let imgDeparture = cruise.FlagDeparture;
            let imgArrival = cruise.FlagArrival;
            imgDeparture.replace(re, '');
            imgArrival.replace(re, '');


            PortDepartureImgHtml = `<img class="PortFlagIMG" src="data:image/png;base64,${imgDeparture}">`
            PortArrivalHtml = `${cruise.PortArrival}`
            PortArrivalImgHtml = `<img class="PortFlagIMG" src="data:image/png;base64,${imgArrival}">`
            PortDepartureHtml = `${cruise.PortDeparture}`

            spanArrivalHtml = `<span class="anotherTxt StartWayTxtBlock">??????????????????????</span><span class="TxtWayBlock">${dataTimDeparture}</span>`
            spanDepartureHtml = `<span class="anotherTxt StartWayTxtBlock">????????????????</span><span class="TxtWayBlock">${dataTimeArrive}</span>`

            distanceHtml = `<hr style="width: calc(100%*${cruise.Ratio})!important" class="LineDistance">`

            PassedHtml = `<span class="TxtRouteBlock">${cruise.Passed} ??. ????????</span><span class="TxtRouteBlock">${cruise.PassedTime}</span>`
            StayHtml = `<span class="TxtRouteBlock">${cruise.Stay} ??. ????????</span><span class="TxtRouteBlock">${cruise.StayTime}</span>`
            for (let point of cruise.Route) {
                pointList.push([point.LAT, point.LON])
            }
        }

        let PortLeaf = L.Icon.extend({
            options: {
                iconSize: [15, 16],
                iconAnchor: [15 / 2, 16 / 2]
            }
        });

        let imgPort = new PortLeaf({
            iconUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAABQNJREFUOE9tlXlQ1HUUwD/f329/u7ALiyDoCh6oeGUhqTP+4ZF2awJ5gmkRklNhTjmWeUXjOKWGTmlZ2aHZZYqmCGlZuJXZjBVhpWnisYCI4C7uwd7HtxEn7Xp/vHnzZt5n3j/v8wT/E9+dbpFH685gPVLLT8frsV+xg4zQO91C/179mTNzOjnZvRiWJsS/x//RqP2jVR44VEPVV1bqG9txOoMInZ6o0wkiQPesLPzeGAGvl3RLEo/PLaRg8jgyU4zXOdeL2lNt8pM9n/FR5V4unm2C+GRQDOD20PvWobRevkCwpRX0XVCNiUQdbfTJ7se8gonk3TWO7KyMTlZn+vV0s3x/1xe8t/sz7DYbpHXDkJBG2BvgngmjmTFlEn6/nd2f7sNqPYYxtTtevxcCbrp30XiiuICH58xq6JWsy+wErtywTW7cuhdHqxvMRtDiISYgHOXIoQrOnz6D2aTQ4QuyZOUGGn+3QYYFwkGwNzJi5E2Uzium5P7RQnx/slUuX7kW61e1iDQLItFIzOeDGBiNRuq+2ULVrhpSUox0t/TkqaXl1J9qIHHQQDwtF9FEiKjLwV13j6d8TRli9baD8rW3P6TZ5kBN7UY02AGRMEIfh4Zk2YISpuTegSDAzt1VvPDSu0hpQFi6IZ0uVJOR6OVWEiypvLxmFWLGsrdkxfY9EFTRp/cg5HGAEkWnaES9HnQyzG+1NdTV/kxJ6VP4OlRSBwzGbmuCpEQIRlETTUTdLuaWPIToctuj0nmxDdVgRtEg7LqEIISq6DHoVPpmWFi3dhVNzTZeLH+FpmY3GExEQiFQVDAkQmcN/W8ahGBogdQnmAm1e6C9jbQBacRrkqYzjVgsFjasX8udEwYSisH2iq95e8suTp46hzEpnrCqEAoIUOMg5EefnIQQ2bOljETA5WNwziDKFj+G393Oqxtfx2wyUVT0IDnDc1A1her9X/LB9kq6dk1j+sw8zF1TeWTBUoRmRPo6EJqKyMxbLG3H/4BIlPG3j6Z89bNYkgXz55exb9uH9Mm+hbc2b8Ljc1H0aCne+os8Xb6O0gX5uH0w9t5H6PD4IRqkX1ZfxP2L35TV1QdBqiSY4sibOIb5jxVT+8MxylY8z5W2Sxz+9iANTed4YPbDZPS7mVc3biIhOYHNW7dx6LufaD9rQ0s2UzS7APFa1c/yyYVLiPokhpRkotJHSdEspk7OQ4+ges8Opk/LxeFo5vSZBrIGDkcaEtizv5oPPq5AETrCzRfIzBnKqrLliN/bpSycU8qvR0+iz0gnZG8Bk0bu5DwK8ycx4ua+pHeFQBCuuDs4We/gjfd38kXNN+D3g06g16tMzb2X55YuvHbLa7dUy83v7eTcuSaULkkgVGKeAPpEI90SNR4szMfjusSBg1YamtxEpIqIi0dRJcLvJGdgP2YVTGXR3PxrPmvxROTWj3awftM7OOx+DGm9icQMRIMhlHiVWNgLMoZQdZjizYSCfkKuNoxGQaoWZtWKZygqyL9hm6vQE7ZGWVF5gMrPj1JXdx6CGiKjJzLqhTitEyadbmh3Q8iDkmJg2JCeLJpXyOxpuYoQQl7X11/WPW93SeuRE+za9zWHj53FGwgTi/joNIVO69zSFG8is0cqtw7JYFTOAIpn3keCdsPc/1H4Vfgvl6Q8/KON2uMn2G+14nA6UBSFvj3SGTNyBGNHDWfYkAz6p6sRsxDa39/An0QtGTGwQdHEAAAAAElFTkSuQmCC`
        })

        for (let port of ofcruiseInfo[0].Ports) {
            let markerOptions = {
                title: [port.PORT],
                icon: imgPort,
            }
            portMarker = L.marker([port.LAT, port.LON], markerOptions).addTo(map)
            portMarker.on('click', function () {
                openInfoPorts(port.CODE)
            })
        }

        SpeedIMG.innerHTML = SpeedTabHtml;
        Speed.innerHTML = mSpeedHtml;
        TempIMG.innerHTML = TemperatureTabHtml;
        Temp.innerHTML = mTempHtml;
        WaveIMG.innerHTML = WaveTabHtml;
        Wave.innerHTML = mWaveHtml;

        CourseIMG.innerHTML = CourseTabHtml;
        Course.innerHTML = mCourseHtml;
        TempWater.innerHTML = TempWaterHtml;
        TempWaterIMG.innerHTML = TempWaterIMGHtml;
        WindSpeedIMG.innerHTML = WindSpeedTabHtml;
        WindSpeed.innerHTML = mWindSpeedHtml;

        PortArrivalIMG.innerHTML = PortArrivalImgHtml;
        PortArrival.innerHTML = PortArrivalHtml;
        PortDepartureIMG.innerHTML = PortDepartureImgHtml;
        PortDeparture.innerHTML = PortDepartureHtml;

        spanArrival.innerHTML = spanArrivalHtml;
        spanDeparture.innerHTML = spanDepartureHtml;

        distance.innerHTML = distanceHtml;

        Passed.innerHTML = PassedHtml;
        Stay.innerHTML = StayHtml;

        allRoute = new L.polyline(pointList, {
            color: 'red',
            weight: '2.5',
            dashArray: '10, 10',
            dashOffset: '0',
            smoothFactor: 1
        }).addTo(map);
    }
}

function startDrawGeoJsonGradient() {

    if (window.navigator.onLine) {

        if (ofpersonData) {
            ofpersonData.splice(0)
        }
        if (ofspeedData) {
            ofspeedData.splice(0)
        }
        if (ofcoords) {
            ofcoords.splice(0)
        }

        let DatePers = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/list_vessels/AG/555`), { fetcher });
        let personData = DatePers.Vessels
        let person = personData[0]

        if (hotlineLayer) {
            map.removeLayer(hotlineLayer)
        }

        let cordSpeed = [];

        let speedData = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/vessel_info/${person.IMO}`), { fetcher });

        let coords = JSON.parse(Get(`http://web.sovfracht.ru/marine_monitor_sfh/hs/DataExchange/vessel_track/${person.IMO}`), { fetcher });

        for (let cor of coords.features) {

            if (cor.geometry.type === 'Point') {
                cordSpeed.push([cor.geometry.coordinates[1], cor.geometry.coordinates[0], cor.properties.speed])
            }
        }

        for (let dataS of speedData) {
            cordSpeed.push([person.LAT, person.LON, dataS.Speed])
        }

        hotlineLayer = L.hotline(cordSpeed, {
            min: 0,
            max: 30,
            palette: {
                0.0: '#FF4500',
                0.07: '#FFA500',
                0.17: '#FFFF00',
                0.3: '#90EE90',
                0.5: '#00BFFF',
                0.7: '#FF00FF',
                1.0: '#800080'
            },
            weight: 2.3,
            outlineColor: '#000000',
            outlineWidth: 0
        });

        hotlineLayer.addTo(map);
        ofpersonData.push(...personData);
        ofcoords.push(coords);
        ofspeedData.push(...speedData);

        localStorage.setItem('ofcoords', JSON.stringify(ofcoords));
        localStorage.setItem('ofspeedData', JSON.stringify(ofspeedData));
        localStorage.setItem('ofpersonData', JSON.stringify(ofpersonData));

    } else {

        let ofcoords = JSON.parse(localStorage.getItem('ofcoords'))
        let ofspeedData = JSON.parse(localStorage.getItem('ofspeedData'))
        let ofpersonData = JSON.parse(localStorage.getItem('ofpersonData'))

        let person = ofpersonData[0]

        if (hotlineLayer) {
            map.removeLayer(hotlineLayer)
        }

        let cordSpeed = [];

        for (let cor of ofcoords[0].features) {
            if (cor.geometry.type === 'Point') {
                cordSpeed.push([cor.geometry.coordinates[1], cor.geometry.coordinates[0], cor.properties.speed])
            }
        }

        for (let dataS of ofspeedData) {
            cordSpeed.push([person.LAT, person.LON, dataS.Speed])
        }

        hotlineLayer = L.hotline(cordSpeed, {
            min: 0,
            max: 30,
            palette: {
                0.0: '#FF4500',
                0.07: '#FFA500',
                0.17: '#FFFF00',
                0.3: '#90EE90',
                0.5: '#00BFFF',
                0.7: '#FF00FF',
                1.0: '#800080'
            },
            weight: 2.3,
            outlineColor: '#000000',
            outlineWidth: 0
        });
        hotlineLayer.addTo(map);
    }
}

window.onload = () => {
    srtTime(), startLoadTable(), createM(), startDrawGeoJsonGradient()
}

setInterval(function () {
    for (let i = 0; i < markerArr.length; i++) {
        map.removeLayer(markerArr[i])
    }
    markerArr.splice(0, markerArr.length);
    pointList.splice(0, pointList.length);
    createM(), startLoadTable(), startDrawGeoJsonGradient(), srtTime()
}, 300000)