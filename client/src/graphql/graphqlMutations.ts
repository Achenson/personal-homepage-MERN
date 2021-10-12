export const ChangeSettingsMutation = `
  mutation ($userId: ID,
    $picBackground: Boolean,
    $defaultImage: String,
    $oneColorForAllCols: Boolean,
    $limitColGrowth: Boolean,
    $hideNonDeletable: Boolean,
    $disableDrag: Boolean,
    $numberOfCols: Int,
    $date: Boolean,
    $description: Boolean,
    $itemsPerPage: Int,
    $backgroundColor: String,
    $folderColor: String
    $noteColor: String
    $rssColor: String
    $uiColor: String
    $colColor_1: String
    $colColor_2: String
    $colColor_3: String
    $colColor_4: String
    $colColorImg_1: String
    $colColorImg_2: String
    $colColorImg_3: String
    $colColorImg_4: String
    ) {
    changeSettings (userId: $userId, 
        picBackground: $picBackground,
        defaultImage: $defaultImage,
        oneColorForAllCols: $oneColorForAllCols,
        limitColGrowth: $limitColGrowth,
        hideNonDeletable: $hideNonDeletable,
        disableDrag: $disableDrag,
        numberOfCols: $numberOfCols,
        date: $date,
        description: $description,
        itemsPerPage: $itemsPerPage,
        backgroundColor: $backgroundColor,
        folderColor: $folderColor
        noteColor: $noteColor
        rssColor: $rssColor
        uiColor:  $uiColor
        colColor_1: $colColor_1
        colColor_2: $colColor_2
        colColor_3: $colColor_3
        colColor_4: $colColor_4
        colColorImg_1: $colColorImg_1
        colColorImg_2: $colColorImg_2
        colColorImg_3: $colColorImg_3
        colColorImg_4: $colColorImg_4
        ) {
            picBackground
            oneColorForAllCols
            limitColGrowth
            hideNonDeletable
            disableDrag
            numberOfCols
            date
            description
            itemsPerPage
            backgroundColor
            folderColor
            noteColor
            rssColor
            uiColor
            colColor_1
            colColor_2
            colColor_3
            colColor_4
            colColorImg_1
            colColorImg_2
            colColorImg_3
            colColorImg_4
    }
  }
`;
