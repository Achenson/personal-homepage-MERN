export const ChangeSettingsMutation = `
  mutation ($userId: ID,
    $defaultImage: String,
    $oneColorForAllCols: Boolean,
    $limitColGrowth: Boolean,
    $hideNonDeletable: Boolean,
    $disableDrag: Boolean,
    $numberOfCols: Int,
    $date:  Boolean,
    $description: Boolean,
    $itemsPerPage: Int,
    ) {
    changeSettings (userId: $userId, defaultImage: $defaultImage,
        oneColorForAllCols: $oneColorForAllCols,
        limitColGrowth: $limitColGrowth,
        hideNonDeletable: $hideNonDeletable,
        disableDrag: $disableDrag,
        numberOfCols: $numberOfCols,
        date: $date,
        description: $description,
        itemsPerPage: $itemsPerPage) {
            oneColorForAllCols
            limitColGrowth
            hideNonDeletable
            disableDrag
            numberOfCols
            date
            description
            itemsPerPage
    }
  }
`;
