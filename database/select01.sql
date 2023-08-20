SELECT 
    v.id AS via_id,
    v.vias,
    v.grau,
    v.crux,
    v.aid,
    v.duracao,
    v.exposicao,
    v.extensao,
    v.conquistadores,
    v.data AS data_conquista,
    f.faces,
    m.montanhas,
    m.altitude,
    fo.fontes
FROM 
    vias_main v
JOIN 
    faces f ON v.face_id = f.face_id
JOIN 
    montanhas m ON v.mount_id = m.mount_id
 JOIN 
    fontes fo ON v.source_id = fo.source_id;
