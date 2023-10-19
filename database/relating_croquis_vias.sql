SELECT
    vm.vias,
    cq.path_to_img,
    cq.autor
FROM
    Vias vm
JOIN
    croquis_vias cv ON vm.id = cv.via_id
JOIN
    Croquis cq ON cq.croqui_id = cv.croqui_id;
