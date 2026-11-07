import { IonItem, IonLabel, IonList, IonSkeletonText } from '@ionic/react';

/** Estado de carga de la lista: filas grises con la misma forma que las películas. */
const ListaSkeleton: React.FC<{ filas?: number }> = ({ filas = 6 }) => (
  <IonList aria-busy="true" aria-label="Cargando películas">
    {Array.from({ length: filas }, (_, i) => (
      <IonItem key={i}>
        <IonLabel>
          <h2>
            <IonSkeletonText animated style={{ width: '60%' }} />
          </h2>
          <p>
            <IonSkeletonText animated style={{ width: '35%' }} />
          </p>
        </IonLabel>
        <IonSkeletonText slot="end" animated style={{ width: '2.5rem' }} />
      </IonItem>
    ))}
  </IonList>
);

export default ListaSkeleton;
